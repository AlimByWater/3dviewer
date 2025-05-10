import { useEffect, useState } from 'react';

const CACHE_PREFIX = 'app_cache_';

function fetchFromCache<T>(url: string): T | null {
  if (typeof window === 'undefined') return null;

  const cacheKey = CACHE_PREFIX + url;
  try {
    const cachedString = localStorage.getItem(cacheKey);
    if (cachedString) {
      return JSON.parse(cachedString) as T;
    }
  } catch (error) {
    console.error('Cache parse error, clearing cache', error);
    localStorage.removeItem(cacheKey);
  }
  return null;
}

async function fetchFromServer<T>(
  url: string,
): Promise<{ data: T | null; error: Error | null }> {
  await new Promise((resolver) => setTimeout(resolver, 5000));

  const cacheKey = CACHE_PREFIX + url;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.statusText);

    const freshData = await response.json();
    localStorage.setItem(cacheKey, JSON.stringify(freshData));

    return {
      data: freshData,
      error: null,
    };
  } catch (freshError) {
    return {
      data: null,
      error: freshError as Error,
    };
  }
}

async function fetchWithCache<T>(
  url: string,
): Promise<{ data: T | null; error?: Error }> {
  await new Promise((resolver) => setTimeout(resolver, 5000));
  // Проверяем доступность localStorage только на клиенте
  if (typeof window === 'undefined') {
    try {
      const response = await fetch(url);
      return { data: await response.json() };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  const cacheKey = CACHE_PREFIX + url;
  let cachedData: T | null = null;

  try {
    const cachedString = localStorage.getItem(cacheKey);
    if (cachedString) {
      cachedData = JSON.parse(cachedString) as T;
    }
  } catch (error) {
    console.error('Cache parse error, clearing cache', error);
    localStorage.removeItem(cacheKey);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.statusText);

    const freshData = await response.json();
    localStorage.setItem(cacheKey, JSON.stringify(freshData));

    return {
      data: freshData,
      error: undefined,
    };
  } catch (freshError) {
    return {
      data: cachedData,
      error: freshError as Error,
    };
  }
}

export function useCachedFetch<T>(url: string): {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
} {
  const [result, setResult] = useState<{ data: T | null; error: Error | null }>(
    {
      data: null,
      error: null,
    },
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const cachedData = fetchFromCache<T>(url);
        if (cachedData) {
          setResult({ data: cachedData, error: null });
        }

        const { data, error } = await fetchFromServer<T>(url);

        if (!isMounted) return;

        if (error) {
          setResult({ data: cachedData, error: error });
        } else {
          setResult({
            data,
            error: error,
          });
        }
      } catch (error) {
        if (isMounted) {
          setResult({
            data: null,
            error: error as Error,
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { ...result, isLoading };
}

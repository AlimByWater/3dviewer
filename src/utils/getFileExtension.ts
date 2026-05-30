/** Extract file extension, handling potential query parameters and complex URLs */
export const getFileExtensionFromUrl = (url: string): string => {
  try {
    // Handle both absolute and relative URLs
    const urlObj = new URL(url, 'http://dummybase');
    const pathname = urlObj.pathname;

    // Extract extension from the last dot in pathname
    const lastDotIndex = pathname.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === pathname.length - 1) {
      return '';
    }

    const extension = pathname.slice(lastDotIndex + 1).toLowerCase();

    // Handle cases where there might be additional path segments after extension
    const firstSlash = extension.indexOf('/');
    return firstSlash === -1 ? extension : extension.slice(0, firstSlash);
  } catch (error) {
    console.warn('Failed to parse URL for extension:', url, error);
    return '';
  }
};

/** Validate if URL points to a valid HDRI file format */
export const isValidHdriUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const extension = getFileExtensionFromUrl(url);
  const validHdriExtensions = ['hdr', 'exr', 'jpg', 'jpeg', 'png', 'webp'];

  return validHdriExtensions.includes(extension);
};

/** Get a safe HDRI URL or return null if invalid */
export const getSafeHdriUrl = (url: string): string | null => {
  if (!url) return null;

  if (isValidHdriUrl(url)) {
    return url;
  }

  console.warn('Invalid HDRI URL format:', url);
  return null;
};

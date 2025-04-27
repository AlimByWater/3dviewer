export type ModelFormat = 'splat' | 'gltf' | 'unknown';

/**
 * Determines the model format based on the file extension in the URL.
 * @param url The URL of the model file.
 * @returns The detected model format ('splat', 'gltf', or 'unknown').
 */
export const getFormat = (url: string): ModelFormat => {
  if (!url) {
    return 'unknown';
  }

  try {
    const path = new URL(url).pathname.toLowerCase();
    if (path.endsWith('.splat') || path.endsWith('.ksplat')) {
      return 'splat';
    }
    if (path.endsWith('.glb') || path.endsWith('.gltf')) {
      return 'gltf';
    }
  } catch (e) {
    // Handle potential URL parsing errors
    console.error('Error parsing URL for format detection:', e);
  }

  return 'unknown';
};
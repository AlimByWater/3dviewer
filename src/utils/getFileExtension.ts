/** Extract file extension, handling potential query parameters */
export const getFileExtensionFromUrl = (url: string) => {
  const fname = new URL(url, 'http://dummybase').pathname; // Use dummy base for relative URLs if needed
  return fname.slice((Math.max(0, fname.lastIndexOf('.')) || Infinity) + 1);
};

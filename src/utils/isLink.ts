export const isLink = (data: string): boolean => {
  return data.match(/^https?:\/\//i) != null;
};

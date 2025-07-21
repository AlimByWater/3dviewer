export const readSvgFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Вспомогательная функция для создания preview SVG
export const createSvgPreview = (svgText: string): string => {
  try {
    const blob = new Blob([svgText], { type: 'image/svg+xml' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error creating SVG preview:', error);
    return '';
  }
};

// Функция для очистки URL объектов при удалении
export const revokeSvgPreview = (url: string) => {
  if (url) URL.revokeObjectURL(url);
};

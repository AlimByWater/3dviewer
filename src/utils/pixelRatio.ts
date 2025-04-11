const maxPixelRatio = 1.5;
const basePixelRatio =
  typeof window !== 'undefined'
    ? Math.min(window.devicePixelRatio, maxPixelRatio)
    : maxPixelRatio;

export const getPixelRatio = (lowQuality: boolean) => {
  return lowQuality ? basePixelRatio * 0.25 : basePixelRatio;
};

export const appPixelRatio = basePixelRatio;

export const isLowPerformanceDevice = () => {
  // Check if device has low pixel ratio (usually indicates lower-end device)
  const hasLowPixelRatio =
    typeof window !== 'undefined' && window.devicePixelRatio < 1.5;

  // Check if device has limited memory (another indicator of lower-end device)
  const hasLimitedMemory =
    navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;

  // Check if device has low number of logical processors
  const hasLimitedCPU =
    navigator.hardwareConcurrency !== undefined &&
    navigator.hardwareConcurrency <= 4;

  // Consider it a low performance device if it meets any two conditions
  const indicators = [hasLowPixelRatio, hasLimitedMemory, hasLimitedCPU].filter(
    Boolean,
  ).length;
  return indicators >= 2;
};

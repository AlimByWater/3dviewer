const maxPixelRatio = 1.5
const basePixelRatio = Math.min(window.devicePixelRatio, maxPixelRatio)

export const getPixelRatio = (isAuthorsPageOpen) => {
  return isAuthorsPageOpen ? basePixelRatio * 0.5 : basePixelRatio
}

export const appPixelRatio = basePixelRatio

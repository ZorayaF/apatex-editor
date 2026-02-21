// src/core/utils/measurements.js
export const CSS_DPI = 96;
export const CM_PER_INCH = 2.54;

export const cmToPx = (cm) => (cm * CSS_DPI) / CM_PER_INCH;
export const ptToPx = (pt) => pt * 1.333;

export const APA_CONFIG = {
  paper: { width: 21.59, height: 27.94 }, // Carta cm
  margins: {
    top: 2.54,
    bottom: 2.54,
    left: 3.0,    // Especial U. Boyacá
    right: 2.54,
  },
  header: {
    topOffset: 1.27, // El encabezado suele ir a media pulgada del borde superior
  },
  typography: {
    family: '"Times New Roman", Times, serif',
    size: 12, // pt
  }
};

export const getPageHeightPx = () => cmToPx(APA_CONFIG.paper.height);

export const getAvailableHeightPx = () => {
  const totalHeight = cmToPx(APA_CONFIG.paper.height);
  const margins = cmToPx(APA_CONFIG.margins.top) + cmToPx(APA_CONFIG.margins.bottom);
  return totalHeight - margins;
};


// src/core/utils/measurements.js

const DPI = 96;
const INCH_TO_CM = 2.54;
const PT_TO_INCH = 72;

// La función de conversión más precisa
export const cmToPx = (cm) => (cm / INCH_TO_CM) * DPI;

export const ptToPx = (pt) => (pt / PT_TO_INCH) * DPI;

export const APA_CONFIG = {
  paper: {
    width: 21.59,  // Ancho Carta en cm
    height: 27.94, // Alto Carta en cm
  },
  margins: {
    top: 2.54,
    bottom: 2.54,
    left: 3.0,     // Universidad de Boyacá
    right: 2.54,
  },
  typography: {
    family: '"Times New Roman", Times, serif',
    size: 12,      // pt
    lineHeight: 1.5, // Doble espacio
    indent: 1.27,  // Sangría media pulgada
  }
};

// Exportamos las constantes ya calculadas para que el sistema sea más rápido
export const PAGE_WIDTH_PX = cmToPx(APA_CONFIG.paper.width);   // ~816px
export const PAGE_HEIGHT_PX = cmToPx(APA_CONFIG.paper.height); // ~1056px

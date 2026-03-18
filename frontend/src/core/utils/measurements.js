/**
 * Constantes de conversión y configuración APA (Carta)
 * Margen izquierdo: 3.0cm (Específico Uniboyacá)
 */

const DPI = 96;
const INCH_TO_CM = 2.54;
const PT_TO_INCH = 72;

// Utilidades de conversión
export const cmToPx = (cm) => (cm / INCH_TO_CM) * DPI;
export const ptToPx = (pt) => (pt / PT_TO_INCH) * DPI;

export const APA_CONFIG = {
  paper: {
    width: 21.59,   // Tamaño Carta (cm)
    height: 27.94,  // Tamaño Carta (cm)
  },
  margins: {
    top: 2.54,
    bottom: 2.54,
    left: 3.0,      // Margen para encuadernación
    right: 2.54,
  },
  typography: {
    family: '"Times New Roman", Times, serif',
    size: 12,        // pt
    lineHeight: 1.5, // Interlineado APA
    indent: 1.27,    // Sangría 1/2 pulgada
  }
};

// Constantes de Página calculadas
export const PAGE_WIDTH_PX = cmToPx(APA_CONFIG.paper.width);
export const PAGE_HEIGHT_PX = cmToPx(APA_CONFIG.paper.height);

// Márgenes en Píxeles
export const MARGIN_TOP_PX = cmToPx(APA_CONFIG.margins.top);
export const MARGIN_BOTTOM_PX = cmToPx(APA_CONFIG.margins.bottom);

// Área máxima de contenido útil (Límite para el motor de desborde)
export const CONTENT_MAX_HEIGHT = PAGE_HEIGHT_PX - MARGIN_TOP_PX - MARGIN_BOTTOM_PX;

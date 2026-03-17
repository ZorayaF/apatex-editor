// features/editor/logic/engine/parser.js

/**
 * Limpia el texto de cualquier HTML y lo divide por saltos de línea.
 * @param {string} rawText - Texto crudo (posiblemente con HTML de un paste)
 * @returns {string[]} - Array de strings limpios
 */
export const cleanAndSplitText = (rawText) => {
  if (!rawText) return [];

  // 1. Eliminar etiquetas HTML (fuerza texto plano)
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = rawText;
  const plainText = tempDiv.textContent || tempDiv.innerText || "";

  // 2. Dividir por saltos de línea (uno o más)
  // Filtramos para evitar bloques vacíos accidentales
  return plainText
    .split(/\n+/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
};

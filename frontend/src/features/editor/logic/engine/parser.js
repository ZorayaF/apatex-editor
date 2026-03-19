// src/features/editor/logic/engine/parser.js

/**
 * Procesa el texto plano y lo fragmenta en párrafos.
 * @param {string} plainText - Texto ya limpio obtenido del clipboard.
 */
export const cleanAndSplitText = (plainText) => {
  if (!plainText) return [];

  return plainText
    .split(/\r?\n/) // 1. Dividimos por cualquier salto de línea
    .map((line) => line.trim()) // 2. Limpiamos espacios laterales
    .filter((line) => line !== ""); // 3. Opcional: Ignorar líneas vacías
};

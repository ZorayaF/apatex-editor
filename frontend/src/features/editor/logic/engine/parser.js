/**
 * Utilidad para procesar texto externo (Clipboard).
 * Extrae solo el contenido plano y lo fragmenta en párrafos.
 */
export const cleanAndSplitText = (rawText) => {
  if (!rawText) return [];

  /**
   * 1. Eliminamos etiquetas HTML.
   * Usamos un elemento temporal para que el navegador extraiga solo 
   * el texto visible, eliminando estilos y scripts del portapapeles.
   */
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = rawText;
  const plainText = tempDiv.textContent || tempDiv.innerText || "";

  /**
   * 2. Segmentación de párrafos.
   * Dividimos por cualquier tipo de salto de línea (\n o \r\n),
   * limpiamos espacios en los extremos y descartamos líneas vacías.
   */
  return plainText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line !== ""); // Solo devolvemos bloques con contenido
};

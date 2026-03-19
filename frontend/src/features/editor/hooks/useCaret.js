import { useCallback } from "react";

export const useCaret = (ref) => {
  /**
   * Obtiene la posición actual del cursor (offset de texto puro)
   */
  const getOffset = useCallback(() => {
    let position = 0;
    const selection = window.getSelection();

    if (selection.rangeCount !== 0 && ref.current) {
      const range = selection.getRangeAt(0);

      // Verificamos que el cursor esté realmente dentro de nuestro elemento
      if (!ref.current.contains(range.commonAncestorContainer)) {
        return 0;
      }

      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(ref.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      position = preCaretRange.toString().length;
    }
    return position;
  }, [ref]);

  /**
   * Coloca el cursor en una posición específica de texto puro
   */
  const setOffset = useCallback(
    (offset) => {
      if (!ref.current) return;

      const range = document.createRange();
      const sel = window.getSelection();
      let charCount = 0;
      let nodeStack = [ref.current];
      let node;
      let found = false;

      // Recorrido por profundidad para encontrar el nodo de texto correcto
      while (!found && (node = nodeStack.pop())) {
        if (node.nodeType === 3) {
          // Nodo de texto
          const nextCharCount = charCount + node.length;
          if (offset <= nextCharCount) {
            try {
              range.setStart(node, offset - charCount);
              range.collapse(true);
              found = true;
            } catch (e) {
              // Fallback si el offset es inválido por algún cambio en el DOM
              range.selectNodeContents(node);
              range.collapse(false);
            }
          }
          charCount = nextCharCount;
        } else {
          // Añadimos hijos al stack en orden inverso para procesarlos correctamente
          let i = node.childNodes.length;
          while (i--) nodeStack.push(node.childNodes[i]);
        }
      }

      // Si terminó el ciclo y no encontró (offset mayor al texto), ponemos al final
      if (!found && ref.current.lastChild) {
        range.selectNodeContents(ref.current);
        range.collapse(false);
      }

      sel.removeAllRanges();
      sel.addRange(range);
    },
    [ref],
  );

  /**
   * Mueve el cursor al final del contenido (útil para saltos de bloque)
   */
  const setAtEnd = useCallback(() => {
    if (!ref.current) return;
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(ref.current);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }, [ref]);

  return { getOffset, setOffset, setAtEnd };
};

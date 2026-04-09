// src/features/editor/hooks/useCaret.js
import { useCallback } from "react";

export const useCaret = (ref) => {
  /**
   * Obtiene la posición GLOBAL del cursor dentro del bloque,
   * tratando a las citas como si fueran un solo "carácter" invisible
   * para que coincida con el índice del string en el Store.
   */
  const getOffset = useCallback(() => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0 || !ref.current) return 0;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();

    // Seleccionamos todo desde el inicio del bloque hasta el cursor
    preCaretRange.selectNodeContents(ref.current);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    // Creamos un contenedor temporal para medir el texto
    const container = document.createElement("div");
    container.appendChild(preCaretRange.cloneContents());

    // IMPORTANTE:
    // Para que el offset coincida con nuestro string de marcadores ((ref:id)),
    // necesitamos una lógica de mapeo.
    // Como solución inmediata, el toString().length es lo más cercano:
    return container.innerText.length;
  }, [ref]);

  const setOffset = useCallback(
    (offset) => {
      if (!ref.current) return;

      const sel = window.getSelection();
      const range = document.createRange();
      let currentOffset = 0;
      let found = false;

      // Función recursiva para encontrar el nodo de texto y la posición
      const traverse = (node) => {
        if (found) return;

        if (node.nodeType === 3) {
          // Nodo de texto
          const nextOffset = currentOffset + node.length;
          if (offset <= nextOffset) {
            range.setStart(node, offset - currentOffset);
            range.collapse(true);
            found = true;
          }
          currentOffset = nextOffset;
        } else if (node.nodeType === 1) {
          // Elemento (como el span de la cita)
          if (node.getAttribute("contenteditable") === "false") {
            // Si es una cita, la saltamos como un bloque
            // Nota: Si quieres que el cursor se pare después de la cita,
            // el offset debe considerar la longitud del texto visible de la cita.
            currentOffset += node.innerText.length;
          } else {
            for (let i = 0; i < node.childNodes.length; i++) {
              traverse(node.childNodes[i]);
            }
          }
        }
      };

      traverse(ref.current);

      if (found) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    },
    [ref],
  );

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

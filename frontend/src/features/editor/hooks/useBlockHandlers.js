import { useCallback } from "react";
import { useStore } from "@store";
import { formatRunInHeading } from "@logic/engine/formatting";

export const useBlockHandlers = ({
  id,
  type,
  textRef,
  isTyping,
  caret,
  content,
}) => {
  const {
    updateBlockContent,
    setSelectedBlockId,
    selectedBlockId,
    splitBlock,
    mergeBlocks,
    setLastCaretOffset,
  } = useStore();

  const { getOffset, setOffset } = caret;

  /**
   * Sincroniza la posición actual del cursor con el Store.
   */
  const syncCaretPosition = useCallback(() => {
    const offset = getOffset();
    setLastCaretOffset(offset);
    return offset;
  }, [getOffset, setLastCaretOffset]);

  /**
   * ESTA ES LA FUNCIÓN CLAVE:
   * Toma el HTML del navegador y lo limpia convirtiendo las citas
   * de nuevo a códigos ((ref:id)) antes de guardarlos.
   */
  const getRawContentFromDOM = useCallback(() => {
    if (!textRef.current) return "";

    // Creamos un clon temporal para no ensuciar lo que el usuario ve
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = textRef.current.innerHTML;

    // Buscamos todos los spans de cita y los revertimos a su "código secreto"
    const citationSpans = tempDiv.querySelectorAll(".apa-citation");
    citationSpans.forEach((span) => {
      const refId = span.getAttribute("data-ref-id");
      // Reemplazamos el nodo visual por el marcador de texto puro
      span.replaceWith(`((ref:${refId}))`);
    });

    // Devolvemos el texto limpio (ahora con los marcadores restaurados)
    return tempDiv.textContent || "";
  }, [textRef]);

  const handleInput = useCallback(() => {
    isTyping.current = true;
    const offset = syncCaretPosition();

    // 1. Obtenemos el contenido restaurando los marcadores ((ref:id))
    const cleanText = getRawContentFromDOM();

    // 2. Notificar al Store (Ahora las citas son inmortales ️)
    updateBlockContent(id, cleanText);

    // 3. Formateo APA para encabezados H4/H5
    if (type === "h4" || type === "h5") {
      // Usamos el texto con marcadores para el formateo
      textRef.current.innerHTML = formatRunInHeading(cleanText, type);
      setOffset(offset);
    }

    setTimeout(() => {
      isTyping.current = false;
    }, 50);
  }, [
    id,
    type,
    textRef,
    isTyping,
    setOffset,
    updateBlockContent,
    syncCaretPosition,
    getRawContentFromDOM,
  ]);

  const handleKeyDown = useCallback(
    (e) => {
      const offset = getOffset();

      if (e.key === "Enter") {
        e.preventDefault();
        // Usamos 'content' del Store que siempre tiene los marcadores originales
        const textBefore = content.slice(0, offset);
        const textAfter = content.slice(offset);
        splitBlock(id, textBefore, textAfter);
      }

      if (e.key === "Backspace" && offset === 0) {
        e.preventDefault();
        mergeBlocks(id);
      }
    },
    [id, getOffset, content, splitBlock, mergeBlocks],
  );

  const handleKeyUp = useCallback(
    (e) => {
      const navigationKeys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ];
      if (navigationKeys.includes(e.key)) {
        syncCaretPosition();
      }
    },
    [syncCaretPosition],
  );

  const handleClick = useCallback(() => {
    syncCaretPosition();
  }, [syncCaretPosition]);

  const handleFocus = useCallback(() => {
    if (selectedBlockId !== id) {
      setSelectedBlockId(id);
    }
    syncCaretPosition();
  }, [id, selectedBlockId, setSelectedBlockId, syncCaretPosition]);

  return {
    handleInput,
    handleKeyDown,
    handleFocus,
    handleKeyUp,
    handleClick,
  };
};

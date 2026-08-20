// src/features/editor/hooks/useBlockHandlers.js
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

  const syncCaretPosition = useCallback(() => {
    const offset = getOffset();
    setLastCaretOffset(offset);
    return offset;
  }, [getOffset, setLastCaretOffset]);

  const getRawContentFromDOM = useCallback(() => {
    if (!textRef.current) return "";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = textRef.current.innerHTML;

    // Revertir citas visuales a formato canónico ((ref:...))
    const citationSpans = tempDiv.querySelectorAll(".apa-citation");
    citationSpans.forEach((span) => {
      const refId = span.getAttribute("data-ref-id");
      span.replaceWith(`((ref:${refId}))`);
    });

    return tempDiv.textContent || "";
  }, [textRef]);

  const handleInput = useCallback(() => {
    isTyping.current = true;
    const offset = syncCaretPosition();
    const cleanText = getRawContentFromDOM();

    updateBlockContent(id, cleanText);

    // Formateo APA dinámico para encabezados de nivel 4 y 5
    if (type === "h4" || type === "h5") {
      textRef.current.innerHTML = formatRunInHeading(cleanText, type);
      if (typeof setOffset === "function") {
        setOffset(offset);
      }
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
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();

        // 1. Obtener la posición del cursor
        const offset = getOffset();

        // 2. Usar el contenido actual del store o extraerlo en vivo si está desfasado
        const currentContent =
          typeof content === "string" ? content : getRawContentFromDOM();

        // 3. Delimitar el punto de partición
        const safeOffset = Math.max(0, Math.min(offset, currentContent.length));
        const textBefore = currentContent.slice(0, safeOffset);
        const textAfter = currentContent.slice(safeOffset);

        splitBlock(id, textBefore, textAfter);
        return;
      }

      if (e.key === "Backspace") {
        const offset = getOffset();
        if (offset === 0) {
          e.preventDefault();
          mergeBlocks(id);
        }
      }
    },
    [id, getOffset, content, splitBlock, mergeBlocks, getRawContentFromDOM],
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

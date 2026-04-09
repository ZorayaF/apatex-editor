// src/features/editor/hooks/useBlockHandlers.js
import { useCallback } from "react";
import { useStore } from "@store";
import { formatRunInHeading } from "../logic/engine/formatting";

export const useBlockHandlers = ({ id, type, textRef, isTyping, caret }) => {
  const {
    updateBlockContent,
    setSelectedBlockId,
    selectedBlockId,
    splitBlock,
    mergeBlocks,
  } = useStore();

  const { getOffset, setOffset } = caret;

  const handleInput = useCallback(() => {
    isTyping.current = true;
    const offset = getOffset();
    const rawText = textRef.current.innerText;

    // 1. Notificar al Store
    updateBlockContent(id, rawText);

    // 2. Formateo inmediato (Run-in headings APA)
    if (type === "h4" || type === "h5") {
      textRef.current.innerHTML = formatRunInHeading(rawText, type);
      setOffset(offset);
    }

    // Pequeño margen para que el Store se estabilice antes de permitir Sync
    setTimeout(() => {
      isTyping.current = false;
    }, 50);
  }, [id, type, textRef, isTyping, getOffset, setOffset, updateBlockContent]);

  const handleKeyDown = useCallback(
    (e) => {
      const offset = getOffset();
      const fullText = textRef.current.innerText;

      if (e.key === "Enter") {
        e.preventDefault();
        splitBlock(id, fullText.slice(0, offset), fullText.slice(offset));
      }

      if (e.key === "Backspace" && offset === 0) {
        e.preventDefault();
        mergeBlocks(id);
      }
    },
    [id, getOffset, textRef, splitBlock, mergeBlocks],
  );

  const handleFocus = useCallback(() => {
    if (selectedBlockId !== id) {
      setSelectedBlockId(id);
    }
  }, [id, selectedBlockId, setSelectedBlockId]);

  return { handleInput, handleKeyDown, handleFocus };
};

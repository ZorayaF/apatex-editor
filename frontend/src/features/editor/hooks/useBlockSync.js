// src/features/editor/hooks/useBlockSync.js
import { useEffect } from "react";
import { useStore } from "@store";
import { formatRunInHeading } from "@logic/engine/formatting";
import { parseCitations } from "@logic/engine/citationEngine";

export const useBlockSync = ({
  id,
  textRef,
  content,
  type,
  selectedBlockId,
  isTyping,
  setAtEnd,
}) => {
  const sources = useStore((s) => s.sources);

  // --- SINCRONIZACIÓN DE CONTENIDO ---
  useEffect(() => {
    if (textRef.current && !isTyping.current) {
      const contentWithCitations = parseCitations(content, sources);

      const isRunIn = type === "h4" || type === "h5";
      const finalHTML = isRunIn
        ? formatRunInHeading(contentWithCitations, type)
        : contentWithCitations;

      if (textRef.current.innerHTML !== finalHTML) {
        textRef.current.innerHTML = finalHTML;
      }
    }
  }, [content, sources, type, textRef, isTyping]);

  // --- GESTIÓN DE FOCO ---
  useEffect(() => {
    if (selectedBlockId === id && textRef.current) {
      if (document.activeElement !== textRef.current) {
        const frameId = requestAnimationFrame(() => {
          if (textRef.current) {
            textRef.current.focus();
            if (typeof setAtEnd === "function") setAtEnd();
          }
        });
        return () => cancelAnimationFrame(frameId);
      }
    }
  }, [selectedBlockId, id, type, textRef, setAtEnd]); // <-- Añadido 'type' a dependencias
};

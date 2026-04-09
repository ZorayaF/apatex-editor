// src/features/editor/hooks/useBlockSync.js
import { useEffect } from "react";
import { formatRunInHeading } from "../logic/engine/formatting";

export const useBlockSync = ({
  id,
  textRef,
  content,
  type,
  selectedBlockId,
  isTyping,
  setAtEnd,
}) => {
  // --- SINCRONIZACIÓN DE CONTENIDO ---
  useEffect(() => {
    // Si el usuario está escribiendo, no tocamos el DOM (evitamos saltos)
    if (textRef.current && !isTyping.current) {
      const isRunIn = type === "h4" || type === "h5";
      const newHTML = isRunIn ? formatRunInHeading(content, type) : content;

      // Solo modificamos el DOM si realmente hay una diferencia
      if (textRef.current.innerHTML !== newHTML) {
        if (isRunIn) textRef.current.innerHTML = newHTML;
        else textRef.current.innerText = content;
      }
    }
  }, [content, type, textRef, isTyping]);

  // --- GESTIÓN DE FOCO ---
  useEffect(() => {
    if (selectedBlockId === id && textRef.current) {
      // Solo forzamos el foco si el navegador no está ya ahí
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
  }, [selectedBlockId, id, textRef, setAtEnd]);
};

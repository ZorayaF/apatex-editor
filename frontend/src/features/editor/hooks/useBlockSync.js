// src/features/editor/hooks/useBlockSync.js
import { useEffect } from "react";
import { useStore } from "@store"; // <--- 1. Necesitamos las fuentes del Store
import { formatRunInHeading } from "../logic/engine/formatting";
import { parseCitations } from "../logic/engine/citationEngine"; // <--- 2. El traductor de citas

export const useBlockSync = ({
  id,
  textRef,
  content,
  type,
  selectedBlockId,
  isTyping,
  setAtEnd,
}) => {
  // Obtenemos las fuentes para que, si el usuario edita un autor, la cita se actualice sola
  const sources = useStore((s) => s.sources);

  // --- SINCRONIZACIÓN DE CONTENIDO ---
  useEffect(() => {
    // Si el usuario está escribiendo, no tocamos el DOM para evitar saltos del cursor
    if (textRef.current && !isTyping.current) {
      // PASO A: Traducimos los códigos ((ref:id)) a HTML visual de citas (Autor, Año)
      const contentWithCitations = parseCitations(content, sources);

      // PASO B: Si es un encabezado H4/H5, aplicamos su lógica de "punto y negrita"
      const isRunIn = type === "h4" || type === "h5";
      const finalHTML = isRunIn
        ? formatRunInHeading(contentWithCitations, type)
        : contentWithCitations;

      // PASO C: Actualizamos el DOM solo si el HTML cambió
      // IMPORTANTE: Ahora usamos innerHTML siempre porque las citas son etiquetas <span>
      if (textRef.current.innerHTML !== finalHTML) {
        textRef.current.innerHTML = finalHTML;
      }
    }
    // Añadimos 'sources' a las dependencias para que las citas re-rendericen si cambian
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
  }, [selectedBlockId, id, textRef, setAtEnd]);
};

// src/features/editor/hooks/useEditor.js
import { useEffect } from "react";
import { useStore } from "@store";

export const useEditor = () => {
  const addBlock = useStore((s) => s.addBlock);
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const canUndo = useStore((s) => s.canUndo);
  const canRedo = useStore((s) => s.canRedo);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (!isCmdOrCtrl) return;

      // Ctrl + Z / Cmd + Z: Deshacer
      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        undo();
      }
      // Ctrl + Y / Cmd + Shift + Z: Rehacer
      else if (
        e.key.toLowerCase() === "y" ||
        (e.key.toLowerCase() === "z" && e.shiftKey)
      ) {
        e.preventDefault();
        e.stopPropagation();
        redo();
      }
    };

    // Usamos el listener en fase de captura (true) para interceptar antes del DOM
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [undo, redo]);

  return {
    insertBlock: addBlock,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};

// src/features/editor/hooks/useEditor.js
import { useEffect } from "react";
import { useStore } from "@store";

export const useEditor = () => {
  const addBlock = useStore((s) => s.addBlock);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (!isCmdOrCtrl) return;

      const key = e.key.toLowerCase();

      // 1. DESHACER: Ctrl + Z o Cmd + Z (sin Shift)
      if (key === "z" && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        const state = useStore.getState();
        if (typeof state.undo === "function") {
          state.undo();
        }
        return;
      }

      // 2. REHACER: Ctrl + Y o Cmd + Shift + Z o Ctrl + Shift + Z
      if (key === "y" || (key === "z" && e.shiftKey)) {
        e.preventDefault();
        e.stopPropagation();
        const state = useStore.getState();
        if (typeof state.redo === "function") {
          state.redo();
        }
        return;
      }
    };

    // 'true' al final activa la fase de captura prioritaria
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  return {
    insertBlock: addBlock,
  };
};

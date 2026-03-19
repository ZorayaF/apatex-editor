// src/features/editor/hooks/useEditor.js
import { useStore } from "@store";

export const useEditor = () => {
  const addBlock = useStore((s) => s.addBlock);

  const insertBlock = (type) => {
    addBlock(type);
  };

  return {
    insertBlock,
  };
};

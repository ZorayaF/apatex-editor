import { create } from 'zustand';

export const useDocStore = create((set) => ({
  blocks: [{ id: '1', type: 'h1', content: 'INTRODUCCIÓN' }],

  // Una única función para actualizar todo el array de bloques
  setBlocks: (newBlocks) => set({ blocks: newBlocks }),

  // Función simple para actualizar el contenido de un bloque específico
  updateBlockContent: (id, content) => set((state) => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, content } : b)
  })),
}));

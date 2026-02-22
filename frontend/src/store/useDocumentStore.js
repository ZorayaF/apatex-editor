import { create } from 'zustand';

export const useDocumentStore = create((set) => ({
  // 1. Datos
  selectedBlockId: null,
  pages: [{ id: 'p1', blockIds: ['b1', 'b2'] }],
  blocks: [
    { id: 'b1', type: 'h1', content: 'TÍTULO DE LA INVESTIGACIÓN' },
    { id: 'b2', type: 'paragraph', content: 'Este es un párrafo inicial.' },
  ],

  // 2. Acciones
  setSelectedBlockId: (id) => set({ selectedBlockId: id }),

  addBlock: (type, content = '') => set((state) => {
    const newId = crypto.randomUUID();
    return {
      blocks: [...state.blocks, { id: newId, type, content }],
      selectedBlockId: newId
    };
  }),

  updateBlock: (id, newContent) => set((state) => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, content: newContent } : b)
  })),

  deleteBlock: (id) => set((state) => ({
    blocks: state.blocks.filter(b => b.id !== id),
    selectedBlockId: null
  }))
}));

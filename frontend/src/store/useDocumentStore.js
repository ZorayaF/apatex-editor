import { create } from 'zustand';

export const useDocumentStore = create((set) => ({
  // Estado inicial con bloques de prueba para el LabPage
  pages: [
    { id: 'p1', blockIds: ['b1', 'b2'] }
  ],

  blocks: [
    { id: 'b1', type: 'h1', content: 'TÍTULO DE LA INVESTIGACIÓN' },
    { id: 'b2', type: 'paragraph', content: 'Este es un párrafo inicial generado desde el Store.' },
  ],

  // Acciones
  addBlock: (type, content = '') => set((state) => ({
    blocks: [...state.blocks, { id: crypto.randomUUID(), type, content }]
  })),

  updateBlock: (id, newContent) => set((state) => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, content: newContent } : b)
  })),

  deleteBlock: (id) => set((state) => ({
    blocks: state.blocks.filter(b => b.id !== id)
  }))
}));

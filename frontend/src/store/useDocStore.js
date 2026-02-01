import { create } from 'zustand';

export const useDocStore = create((set) => ({
  currentPage: 'home', // 'home' | 'editor'

  // Datos iniciales de prueba
  blocks: [
    { id: '1', type: 'h1', content: 'INTRODUCCIÓN' },
    { id: '2', type: 'p', content: 'Escribe aquí el inicio de tu tesis...' }
  ],

  // Navegación
  setPage: (page) => set({ currentPage: page }),

  // Acciones de Bloques
  addBlock: (type = 'p') => set((state) => ({
    blocks: [...state.blocks, {
      id: Date.now().toString(),
      type,
      content: ''
    }]
  })),

  updateBlock: (id, newContent) => set((state) => ({
    blocks: state.blocks.map((b) =>
      b.id === id ? { ...b, content: newContent } : b
    )
  })),
}));

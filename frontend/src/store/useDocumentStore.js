import { create } from 'zustand';

export const useDocumentStore = create((set) => ({
  selectedBlockId: null,
  // Lista maestra de todos los bloques
  blocks: [
    { id: 'b1', type: 'h1', content: 'TÍTULO DE LA INVESTIGACIÓN' },
    { id: 'b2', type: 'paragraph', content: 'Este es un párrafo inicial.' },
  ],

  pages: [
    { id: 'p1', blockIds: ['b1', 'b2'] }
  ],

  setSelectedBlockId: (id) => set({ selectedBlockId: id }),
  addPage: () => set((state) => ({
    pages: [...state.pages, { id: crypto.randomUUID(), blockIds: [] }]
  })),

  // Ajustamos addBlock para que por defecto añada al final de la última página
  addBlock: (type, content = '') => set((state) => {
    const newId = crypto.randomUUID();
    const newBlock = { id: newId, type, content };

    // Añadimos el bloque a la lista maestra y su ID a la última página
    const updatedPages = [...state.pages];
    const lastPageIndex = updatedPages.length - 1;
    updatedPages[lastPageIndex].blockIds.push(newId);

    return {
      blocks: [...state.blocks, newBlock],
      pages: updatedPages,
      selectedBlockId: newId
    };
  }),
  updateBlock: (id, newContent) => set((state) => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, content: newContent } : b)
  })),

  deleteBlock: (id) => set((state) => ({
    // 1. Eliminar de la lista maestra de bloques
    blocks: state.blocks.filter(b => b.id !== id),

    // 2. Eliminar el ID de cualquier página que lo contenga
    pages: state.pages.map(page => ({
      ...page,
      blockIds: page.blockIds.filter(blockId => blockId !== id)
    })),

    selectedBlockId: null
  }))
}));

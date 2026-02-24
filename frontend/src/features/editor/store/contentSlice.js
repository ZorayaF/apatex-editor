import { calculateBlockInsertion } from './editorUtils';

export const createContentSlice = (set, get) => ({
  blocks: [
    { id: 'b1', type: 'h1', content: 'TÍTULO DE LA INVESTIGACIÓN' },
    { id: 'b2', type: 'paragraph', content: 'Este es un párrafo inicial.' },
  ],
  pages: [
    { id: 'p1', blockIds: ['b1', 'b2'] }
  ],

  addPage: () => set((state) => ({
    pages: [...state.pages, { id: crypto.randomUUID(), blockIds: [] }],
    activePageIndex: state.pages.length
  })),

  addBlock: (type, content = '') => set((state) => {
    const newId = crypto.randomUUID();
    const newBlock = { id: newId, type, content };

    // ¡Aquí ocurre la magia! Delegamos la complejidad al util
    const { updatedPages, targetPageIndex } = calculateBlockInsertion(
      state.pages,
      state.blocks,
      state.activePageIndex,
      state.selectedBlockId,
      type,
      newId
    );

    return {
      blocks: [...state.blocks, newBlock],
      pages: updatedPages,
      selectedBlockId: newId, // Auto-seleccionar el nuevo
      activePageIndex: targetPageIndex // Mover el foco si cambió de página
    };
  }),

  updateBlock: (id, newContent) => set((state) => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, content: newContent } : b)
  })),

  deleteBlock: (id) => set((state) => ({
    blocks: state.blocks.filter(b => b.id !== id),
    pages: state.pages.map(page => ({
      ...page,
      blockIds: page.blockIds.filter(blockId => blockId !== id)
    })),
    selectedBlockId: null
  })),
});

import { create } from 'zustand';

export const useDocumentStore = create((set) => ({
  // --- ESTADO ---
  selectedBlockId: null,
  activePageIndex: 0,

  // Lista maestra de datos
  blocks: [
    { id: 'b1', type: 'h1', content: 'TÍTULO DE LA INVESTIGACIÓN' },
    { id: 'b2', type: 'paragraph', content: 'Este es un párrafo inicial.' },
  ],

  // Estructura de páginas (IDs de bloques)
  pages: [
    { id: 'p1', blockIds: ['b1', 'b2'] }
  ],

  // --- ACCIONES DE NAVEGACIÓN Y SELECCIÓN ---

  setActivePage: (index) => set({ activePageIndex: index }),

  setSelectedBlockId: (id) => set((state) => {
    if (!id) return { selectedBlockId: null };

    // Al seleccionar un bloque, detectamos automáticamente en qué página vive
    const pageIndex = state.pages.findIndex(p => p.blockIds.includes(id));

    return {
      selectedBlockId: id,
      activePageIndex: pageIndex !== -1 ? pageIndex : state.activePageIndex
    };
  }),

  // --- ACCIONES DE ESTRUCTURA (PÁGINAS) ---

  addPage: () => set((state) => ({
    pages: [...state.pages, { id: crypto.randomUUID(), blockIds: [] }],
    activePageIndex: state.pages.length // Mover el foco a la nueva página
  })),

  // --- ACCIONES DE CONTENIDO (BLOQUES) ---

  addBlock: (type, content = '') => set((state) => {
    const newId = crypto.randomUUID();
    const newBlock = { id: newId, type, content };
    let updatedPages = [...state.pages];

    let targetPageIndex = state.activePageIndex;
    let insertIndex = updatedPages[targetPageIndex].blockIds.length;

    // --- REGLA ESPECIAL PARA H1 (TÍTULO 1) ---
    if (type === 'h1') {
      // Si la página activa YA tiene bloques, creamos una página nueva
      if (updatedPages[targetPageIndex].blockIds.length > 0) {
        const newPageId = crypto.randomUUID();
        const newPage = { id: newPageId, blockIds: [] };

        // Insertamos la página justo después de la actual
        updatedPages.splice(targetPageIndex + 1, 0, newPage);

        // El objetivo ahora es la nueva página, al principio
        targetPageIndex = targetPageIndex + 1;
        insertIndex = 0;
      }
    }
    // --- LÓGICA NORMAL (Si hay algo seleccionado) ---
    else if (state.selectedBlockId) {
      const pageIndex = updatedPages.findIndex(page =>
        page.blockIds.includes(state.selectedBlockId)
      );

      if (pageIndex !== -1) {
        targetPageIndex = pageIndex;
        const blockIndex = updatedPages[pageIndex].blockIds.indexOf(state.selectedBlockId);
        insertIndex = blockIndex + 1;
      }
    }

    // Insertar el bloque en la página y posición decidida
    updatedPages[targetPageIndex].blockIds.splice(insertIndex, 0, newId);

    return {
      blocks: [...state.blocks, newBlock],
      pages: updatedPages,
      selectedBlockId: newId, // Se selecciona automáticamente
      activePageIndex: targetPageIndex // Nos situamos en la página donde quedó el bloque
    };
  }),

  updateBlock: (id, newContent) => set((state) => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, content: newContent } : b)
  })),

  deleteBlock: (id) => set((state) => ({
    // Limpieza profunda: eliminar del maestro y de las páginas
    blocks: state.blocks.filter(b => b.id !== id),
    pages: state.pages.map(page => ({
      ...page,
      blockIds: page.blockIds.filter(blockId => blockId !== id)
    })),
    selectedBlockId: null
  })),
}));

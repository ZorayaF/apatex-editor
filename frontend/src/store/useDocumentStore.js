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

    // Ajuste por selección previa
    if (state.selectedBlockId) {
      const pIdx = updatedPages.findIndex(p => p.blockIds.includes(state.selectedBlockId));
      if (pIdx !== -1) {
        targetPageIndex = pIdx;
        insertIndex = updatedPages[pIdx].blockIds.indexOf(state.selectedBlockId) + 1;
      }
    }

    // --- LÓGICA DE INTELIGENCIA PARA TÍTULO 1 (H1) ---
    if (type === 'h1') {
      const currentPage = updatedPages[targetPageIndex];

      // Verificamos si la página ACTUAL ya tiene un H1
      const currentPageHasH1 = currentPage.blockIds.some(id =>
        state.blocks.find(b => b.id === id)?.type === 'h1'
      );

      if (!currentPageHasH1) {
        // CASO 0: La página tiene texto pero NO tiene Título 1.
        // El título "reclama" el inicio de la página actual.
        insertIndex = 0;
      } else {
        // Si la actual ya tiene un H1, aplicamos la lógica de "mirar adelante"
        const nextPageIndex = targetPageIndex + 1;
        const nextPage = updatedPages[nextPageIndex];

        if (!nextPage) {
          // No existe P2, la creamos
          updatedPages.push({ id: crypto.randomUUID(), blockIds: [] });
          targetPageIndex = nextPageIndex;
          insertIndex = 0;
        } else {
          const nextPageHasH1 = nextPage.blockIds.some(id =>
            state.blocks.find(b => b.id === id)?.type === 'h1'
          );

          if (!nextPageHasH1) {
            // CASO 2 y 3: La siguiente está vacía o tiene texto sin H1.
            // Saltamos a la siguiente y tomamos el inicio.
            targetPageIndex = nextPageIndex;
            insertIndex = 0;
          } else {
            // CASO 4: La siguiente ya tiene un H1.
            // Creamos una hoja nueva intermedia.
            updatedPages.splice(nextPageIndex, 0, { id: crypto.randomUUID(), blockIds: [] });
            targetPageIndex = nextPageIndex;
            insertIndex = 0;
          }
        }
      }
    }

    // Inserción final
    updatedPages[targetPageIndex].blockIds.splice(insertIndex, 0, newId);

    return {
      blocks: [...state.blocks, newBlock],
      pages: updatedPages,
      selectedBlockId: newId,
      activePageIndex: targetPageIndex
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

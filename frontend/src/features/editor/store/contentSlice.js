import { calculateSplit } from '../logic/engine/insertionEngine';
import { cleanAndSplitText } from '../logic/engine/parser';

export const createContentSlice = (set, get) => ({
  // --- ESTADO ---
  blocks: [],
  pages: [{ id: 'p1', blockIds: [] }],
  activePageIndex: 0,
  selectedBlockId: null,

  // --- NAVEGACIÓN Y SELECCIÓN ---
  setActivePage: (index) => set({ activePageIndex: index }),

  setSelectedBlockId: (id) => set((state) => {
    if (!id) return { selectedBlockId: null };

    // Sincroniza la página activa basándose en la ubicación del bloque
    const pageIndex = state.pages.findIndex(p => p.blockIds.includes(id));

    return {
      selectedBlockId: id,
      activePageIndex: pageIndex !== -1 ? pageIndex : state.activePageIndex
    };
  }),

  // --- GESTIÓN DE BLOQUES ---
  // --- ACCIÓN: AÑADIR BLOQUE INTELIGENTE ---
  addBlock: (type = 'paragraph') => set((state) => {
    const newId = crypto.randomUUID();
    const newBlock = { id: newId, type, content: '' };

    let newPages = [...state.pages];
    let newActiveIndex = state.activePageIndex;

    // --- LÓGICA ESPECIAL PARA TÍTULOS (H1) ---
    if (type === 'h1') {
      const currentPage = newPages[newActiveIndex];

      // Verificamos si la página actual ya tiene un H1
      const hasH1 = currentPage.blockIds.some(id =>
        state.blocks.find(b => b.id === id)?.type === 'h1'
      );

      if (!hasH1) {
        // CASO 1 y 2: No hay H1 o está vacía -> Insertar al inicio de la actual
        currentPage.blockIds = [newId, ...currentPage.blockIds];
      } else {
        const nextPageIndex = newActiveIndex + 1;
        const nextPage = newPages[nextPageIndex];

        if (!nextPage) {
          // No hay siguiente -> Crear una al final
          newPages.push({ id: crypto.randomUUID(), blockIds: [newId] });
          newActiveIndex = nextPageIndex;
        } else if (nextPage.blockIds.length === 0) {
          // CASO 3: Siguiente existe y está vacía -> Insertar ahí
          newPages[nextPageIndex].blockIds = [newId];
          newActiveIndex = nextPageIndex;
        } else {
          // CASO 4: Siguiente tiene contenido -> Inyectar nueva página en medio
          newPages.splice(nextPageIndex, 0, {
            id: crypto.randomUUID(),
            blockIds: [newId]
          });
          newActiveIndex = nextPageIndex;
        }
      }
    }
    // --- LÓGICA PARA PÁRRAFOS NORMALES ---
    else {
      newPages = newPages.map((page, index) => {
        if (index === newActiveIndex) {
          return { ...page, blockIds: [...page.blockIds, newId] };
        }
        return page;
      });
    }

    return {
      blocks: [...state.blocks, newBlock],
      pages: newPages,
      activePageIndex: newActiveIndex,
      selectedBlockId: newId,
    };
  }),

  updateBlockContent: (id, content) => set((state) => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, content } : b)
  })),

  // --- LÓGICA DE ESCRITURA (ENTER) ---
  splitBlock: (originalBlockId, textBefore, textAfter) => set((state) => {
    const { updatedBlocks, updatedPages, newBlockId } = calculateSplit({
      blocks: state.blocks,
      pages: state.pages,
      blockId: originalBlockId,
      textBefore,
      textAfter
    });

    return {
      blocks: updatedBlocks,
      pages: updatedPages,
      selectedBlockId: newBlockId,
    };
  }),

  // --- LÓGICA DE PEGADO (PASTE) ---
  handlePasteText: (rawText) => set((state) => {
    const lines = cleanAndSplitText(rawText);
    if (lines.length === 0) return state;

    let currentBlocks = [...state.blocks];
    let currentPages = [...state.pages];
    let lastNewId = state.selectedBlockId;

    const activeBlock = currentBlocks.find(b => b.id === state.selectedBlockId);
    const isCurrentEmpty = activeBlock && activeBlock.content.trim() === "";

    let linesToProcess = [...lines];

    // Si el bloque actual está vacío, lo reutilizamos para la primera línea
    if (isCurrentEmpty) {
      const firstLine = linesToProcess.shift();
      currentBlocks = currentBlocks.map(b =>
        b.id === state.selectedBlockId ? { ...b, content: firstLine } : b
      );
    }

    // Insertar el resto de las líneas como bloques nuevos
    linesToProcess.forEach((line) => {
      const newId = crypto.randomUUID();
      currentBlocks.push({ id: newId, type: 'paragraph', content: line });

      currentPages = currentPages.map((page, idx) => {
        if (idx === state.activePageIndex) {
          const currentIndex = page.blockIds.indexOf(lastNewId);
          const newBlockIds = [...page.blockIds];
          newBlockIds.splice(currentIndex + 1, 0, newId);
          return { ...page, blockIds: newBlockIds };
        }
        return page;
      });

      lastNewId = newId;
    });

    return {
      blocks: currentBlocks,
      pages: currentPages,
      selectedBlockId: lastNewId
    };
  }),

  // --- LÓGICA DE PAGINACIÓN (PUSH) ---
  moveToNextPage: (blockId) => set((state) => {
    const fromPageIndex = state.pages.findIndex(p => p.blockIds.includes(blockId));
    if (fromPageIndex === -1) return state;

    const newPages = [...state.pages];

    // 1. Extraer de la página actual
    newPages[fromPageIndex].blockIds = newPages[fromPageIndex].blockIds.filter(id => id !== blockId);

    // 2. Insertar en la siguiente (creándola si no existe)
    if (!newPages[fromPageIndex + 1]) {
      newPages.push({ id: crypto.randomUUID(), blockIds: [] });
    }

    newPages[fromPageIndex + 1].blockIds = [blockId, ...newPages[fromPageIndex + 1].blockIds];

    return {
      pages: newPages,
      activePageIndex: fromPageIndex + 1
    };
  }),
});

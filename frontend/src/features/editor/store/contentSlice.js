// features/editor/store/contentSlice.js
import { calculateSplit } from '../logic/engine/insertionEngine';
import { cleanAndSplitText } from '../logic/engine/parser';

export const createContentSlice = (set, get) => ({
  // --- ESTADO ---
  blocks: [],
  pages: [{ id: 'p1', blockIds: [] }],
  activePageIndex: 0,
  selectedBlockId: null,

  // --- ACCIÓN: DIVIDIR BLOQUE (Para el Enter) ---
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
      selectedBlockId: newBlockId, // El foco salta automáticamente al nuevo bloque
    };
  }),
  addBlock: (type = 'paragraph') => set((state) => {
    const newId = crypto.randomUUID();
    const newBlock = { id: newId, type, content: '' };

    // 1. Añadimos el bloque al array global
    const updatedBlocks = [...state.blocks, newBlock];

    // 2. Lo añadimos a la página activa actual
    const updatedPages = state.pages.map((page, index) => {
      if (index === state.activePageIndex) {
        return {
          ...page,
          blockIds: [...page.blockIds, newId]
        };
      }
      return page;
    });

    return {
      blocks: updatedBlocks,
      pages: updatedPages,
      selectedBlockId: newId, // Para que el cursor salte allí de inmediato
    };
  }),

  // --- ACCIÓN: PEGAR/INSERTAR MÚLTIPLES (Para el Paste) ---
  handlePasteText: (rawText) => set((state) => {
    const lines = cleanAndSplitText(rawText);
    if (lines.length === 0) return state;

    let currentBlocks = [...state.blocks];
    let currentPages = [...state.pages];
    let lastNewId = state.selectedBlockId;

    // Insertamos cada línea como un bloque independiente
    lines.forEach((line) => {
      const newId = crypto.randomUUID();
      const newBlock = { id: newId, type: 'paragraph', content: line };

      currentBlocks.push(newBlock);

      // Los añadimos a la página activa actual
      currentPages = currentPages.map((page, idx) => {
        if (idx === state.activePageIndex) {
          return { ...page, blockIds: [...page.blockIds, newId] };
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

  // --- SETTERS AUXILIARES ---
  updateBlockContent: (id, content) => set((state) => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, content } : b)
  })),

  setSelectedBlock: (id) => set({ selectedBlockId: id }),
});

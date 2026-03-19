// features/editor/store/contentSlice.js
import {
  calculateSplit,
  calculateNewBlockStructure,
  calculatePasteStructure,
} from "../logic/engine/insertionEngine";
import { cleanAndSplitText } from "../logic/engine/parser";

export const createContentSlice = (set, get) => ({
  blocks: [],
  pages: [{ id: "p1", blockIds: [] }],
  activePageIndex: 0,
  selectedBlockId: null,

  // --- NAVEGACIÓN ---
  setActivePage: (index) => set({ activePageIndex: index }),

  setSelectedBlockId: (id) =>
    set((state) => ({
      selectedBlockId: id,
      activePageIndex: id
        ? state.pages.findIndex((p) => p.blockIds.includes(id))
        : state.activePageIndex,
    })),

  // --- ACCIONES (Delegando al Engine) ---

  addBlock: (type = "paragraph") =>
    set((state) => {
      const newId = crypto.randomUUID();
      const { newBlock, newPages, newActiveIndex } = calculateNewBlockStructure(
        {
          type,
          state,
          newId,
        },
      );

      return {
        blocks: [...state.blocks, newBlock],
        pages: newPages,
        activePageIndex: newActiveIndex,
        selectedBlockId: newId,
      };
    }),

  handlePasteText: (rawText) =>
    set((state) => {
      const result = calculatePasteStructure({
        rawText,
        state,
        cleanAndSplitText,
      });
      if (!result) return state;

      return {
        blocks: result.currentBlocks,
        pages: result.currentPages,
        selectedBlockId: result.lastNewId,
      };
    }),

  splitBlock: (originalBlockId, textBefore, textAfter) =>
    set((state) => {
      const result = calculateSplit({
        blocks: state.blocks,
        pages: state.pages,
        blockId: originalBlockId,
        textBefore,
        textAfter,
      });

      return {
        blocks: result.updatedBlocks,
        pages: result.updatedPages,
        selectedBlockId: result.newBlockId,
      };
    }),

  // --- ACTUALIZACIÓN SIMPLE ---
  updateBlockContent: (id, content) =>
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
    })),

  // --- PAGINACIÓN ---
  moveToNextPage: (blockId) =>
    set((state) => {
      const fromPageIndex = state.pages.findIndex((p) =>
        p.blockIds.includes(blockId),
      );
      if (fromPageIndex === -1) return state;

      const newPages = JSON.parse(JSON.stringify(state.pages));
      const targetPageIndex = fromPageIndex + 1;
      const nextPage = newPages[targetPageIndex];

      // 1. Extraer el bloque de la página actual
      newPages[fromPageIndex].blockIds = newPages[
        fromPageIndex
      ].blockIds.filter((id) => id !== blockId);

      // 2. LÓGICA DE DETECCIÓN DE H1 EN DESTINO
      const targetHasH1 =
        nextPage &&
        nextPage.blockIds.some(
          (id) => state.blocks.find((b) => b.id === id)?.type === "h1",
        );

      if (targetHasH1) {
        // REGLA NUEVA: Si hay un H1, creamos una página intermedia
        // para que el texto desbordado no se mezcle con el título principal.
        newPages.splice(targetPageIndex, 0, {
          id: crypto.randomUUID(),
          blockIds: [blockId],
        });
      } else if (!nextPage) {
        // Si no hay página siguiente, la creamos al final
        newPages.push({
          id: crypto.randomUUID(),
          blockIds: [blockId],
        });
      } else {
        // Si la página siguiente existe y NO tiene H1, simplemente lo ponemos al inicio
        nextPage.blockIds = [blockId, ...nextPage.blockIds];
      }

      return {
        pages: newPages,
        activePageIndex: targetPageIndex, // El foco sigue al bloque
        selectedBlockId: blockId,
      };
    }),
});

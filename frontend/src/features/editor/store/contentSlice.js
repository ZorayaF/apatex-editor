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
      const fromIdx = state.pages.findIndex((p) =>
        p.blockIds.includes(blockId),
      );
      if (fromIdx === -1) return state;

      const newPages = JSON.parse(JSON.stringify(state.pages));
      newPages[fromIdx].blockIds = newPages[fromIdx].blockIds.filter(
        (id) => id !== blockId,
      );

      if (!newPages[fromIdx + 1]) {
        newPages.push({ id: crypto.randomUUID(), blockIds: [] });
      }
      newPages[fromIdx + 1].blockIds = [
        blockId,
        ...newPages[fromIdx + 1].blockIds,
      ];

      return {
        pages: newPages,
        activePageIndex: fromIdx + 1,
        selectedBlockId: blockId,
      };
    }),
});

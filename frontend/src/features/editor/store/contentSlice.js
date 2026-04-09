// src/store/slices/contentSlice.js
import {
  calculateSplit,
  calculateNewBlockStructure,
  calculatePasteStructure,
  calculateMerge,
} from "../logic/engine/insertionEngine";
import { cleanAndSplitText } from "../logic/engine/parser";

export const createContentSlice = (set, get) => ({
  blocks: [],
  pages: [{ id: "p1", blockIds: [] }],
  activePageIndex: 0,
  selectedBlockId: null,
  focusedChapterId: null,

  // --- NUEVO ESTADO PARA CITAS ---
  lastCaretOffset: 0, // <--- Aquí guardamos la "memoria" del cursor

  // --- NAVEGACIÓN ---
  setActivePage: (index) => set({ activePageIndex: index }),

  setSelectedBlockId: (id) =>
    set((state) => ({
      selectedBlockId: id,
      activePageIndex: id
        ? state.pages.findIndex((p) => p.blockIds.includes(id))
        : state.activePageIndex,
    })),

  // --- NUEVA ACCIÓN: SOLUCIONA EL ERROR DE CONSOLA ---
  setLastCaretOffset: (offset) => set({ lastCaretOffset: offset }),

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

      if (type === "table") {
        newBlock.title = "Título de la tabla";
        newBlock.note = "Nota.";
        newBlock.data = [
          ["Encabezado 1", "Encabezado 2", "Encabezado 3"],
          ["", "", ""],
          ["", "", ""],
        ];
      }

      const isComplex = ["table", "figure"].includes(type);

      return {
        blocks: [...state.blocks, newBlock],
        pages: newPages,
        activePageIndex: newActiveIndex,
        selectedBlockId: newId,
        ...(isComplex && {
          isInspectorOpen: true,
          activeTab: "properties",
        }),
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

  mergeBlocks: (currentBlockId) =>
    set((state) => {
      const result = calculateMerge({ state, currentBlockId });
      if (!result) return state;

      return {
        blocks: result.updatedBlocks,
        pages: result.updatedPages,
        selectedBlockId: result.prevBlockId,
      };
    }),

  updateBlockContent: (id, content) =>
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
    })),

  updateBlock: (id, updates) =>
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
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

      newPages[fromPageIndex].blockIds = newPages[
        fromPageIndex
      ].blockIds.filter((id) => id !== blockId);

      const targetHasH1 =
        nextPage &&
        nextPage.blockIds.some(
          (id) => state.blocks.find((b) => b.id === id)?.type === "h1",
        );

      if (targetHasH1) {
        newPages.splice(targetPageIndex, 0, {
          id: crypto.randomUUID(),
          blockIds: [blockId],
        });
      } else if (!nextPage) {
        newPages.push({
          id: crypto.randomUUID(),
          blockIds: [blockId],
        });
      } else {
        nextPage.blockIds = [blockId, ...nextPage.blockIds];
      }

      return {
        pages: newPages,
        activePageIndex: targetPageIndex,
        selectedBlockId: blockId,
      };
    }),

  // --- GESTIÓN DE REFERENCIAS (BIBLIOGRAFÍA) ---
  sources: [],

  addAndEditSource: (type) => {
    const { sources } = get();

    const emptySource = sources.find(
      (s) => !s.author && !s.title && s.type === type,
    );

    if (emptySource) {
      get().setSelectedSourceId(emptySource.id);
      return;
    }

    const newId = crypto.randomUUID();
    const newSource = {
      id: newId,
      type,
      author: "",
      title: "",
      year: "",
      metadata: {},
    };

    set((state) => ({
      sources: [...state.sources, newSource],
    }));

    get().setSelectedSourceId(newId);
  },

  updateSource: (id, updates) =>
    set((state) => ({
      sources: state.sources.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
    })),

  removeSource: (id) =>
    set((state) => ({
      sources: state.sources.filter((s) => s.id !== id),
    })),

  setFocusedChapterId: (id) => set({ focusedChapterId: id }),

  clearFocus: () => set({ focusedChapterId: null }),

  insertCitation: (blockId, sourceId, visualOffset) =>
    set((state) => {
      const block = state.blocks.find((b) => b.id === blockId);
      if (!block) return state;

      const marker = `((ref:${sourceId}))`;
      const content = block.content || "";

      let visualCount = 0;
      let logicalIndex = 0;
      const regex = /\(\(ref:[\w-]+\)\)/g;

      let match;
      const markers = [];
      while ((match = regex.exec(content)) !== null) {
        const refId = match[0].match(/ref:([\w-]+)/)[1];
        const source = state.sources.find((s) => s.id === refId);
        const visualText = source
          ? `(${source.author}, ${source.year})`
          : "(...)";

        markers.push({
          start: match.index,
          end: match.index + match[0].length,
          visualLength: visualText.length,
        });
      }

      let finalLogicalIndex = content.length;
      let currentVisualPos = 0;
      let lastMarkerEnd = 0;

      for (const m of markers) {
        const textBeforeLength = m.start - lastMarkerEnd;
        if (visualOffset <= currentVisualPos + textBeforeLength) {
          finalLogicalIndex = lastMarkerEnd + (visualOffset - currentVisualPos);
          break;
        }
        currentVisualPos += textBeforeLength + m.visualLength;
        lastMarkerEnd = m.end;

        if (visualOffset <= currentVisualPos) {
          finalLogicalIndex = m.end;
          break;
        }
      }

      if (finalLogicalIndex === content.length && markers.length > 0) {
        const remainingVisual = visualOffset - currentVisualPos;
        finalLogicalIndex = lastMarkerEnd + remainingVisual;
      } else if (markers.length === 0) {
        finalLogicalIndex = visualOffset;
      }

      const newContent =
        content.slice(0, finalLogicalIndex) +
        marker +
        content.slice(finalLogicalIndex);

      return {
        blocks: state.blocks.map((b) =>
          b.id === blockId ? { ...b, content: newContent } : b,
        ),
      };
    }),
});

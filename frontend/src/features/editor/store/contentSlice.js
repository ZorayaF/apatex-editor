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

      // 1. Usamos tu motor actual para calcular la posición y estructura básica
      const { newBlock, newPages, newActiveIndex } = calculateNewBlockStructure(
        {
          type,
          state,
          newId,
        },
      );

      // 2. Si es una TABLA, le inyectamos la estructura APA por defecto
      if (type === "table") {
        newBlock.title = "Título de la tabla"; // En cursiva según APA
        newBlock.note = "Nota."; // Tamaño 10 según APA
        // Matriz inicial 3x3 (Fila 0 es el encabezado)
        newBlock.data = [
          ["Encabezado 1", "Encabezado 2", "Encabezado 3"],
          ["", "", ""],
          ["", "", ""],
        ];
      }

      // 3. Verificamos si es un objeto complejo para activar el Inspector
      const isComplex = ["table", "figure"].includes(type);

      return {
        blocks: [...state.blocks, newBlock],
        pages: newPages,
        activePageIndex: newActiveIndex,
        selectedBlockId: newId,
        // Abrimos el inspector y movemos a la pestaña de diseño automáticamente
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

  // --- ESTA ES LA QUE FALTABA PARA QUE EL FORMULARIO FUNCIONE ---
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
});

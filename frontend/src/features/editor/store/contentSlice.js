// src/features/editor/store/contentSlice.js
import {
  calculateSplit,
  calculateNewBlockStructure,
  calculatePasteStructure,
  calculateMerge,
} from "@logic/engine/insertionEngine";
import { cleanAndSplitText } from "@logic/engine/parser";

const MAX_HISTORY = 40;

// Clon profundo del árbol JSON del documento
const createSnapshot = (state) => ({
  blocks: JSON.parse(JSON.stringify(state.blocks)),
  pages: JSON.parse(JSON.stringify(state.pages)),
  sources: JSON.parse(JSON.stringify(state.sources)),
});

// Control de ráfaga para escritura de texto (Nivel 1)
let typingTimer = null;
let typingSnapshot = null;

export const createContentSlice = (set, get) => {
  // Guarda un snapshot INMEDIATO para acciones de bloque (Nivel 2)
  const commitInstantSnapshot = (state) => {
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = null;
      typingSnapshot = null;
    }
    const snapshot = createSnapshot(state);
    const newPast = [...state.past, snapshot].slice(-MAX_HISTORY);
    return {
      past: newPast,
      future: [],
      canUndo: true,
      canRedo: false,
    };
  };

  // Agrupa la escritura de palabras antes de guardar el snapshot (Nivel 1)
  const registerTyping = () => {
    if (!typingSnapshot) {
      typingSnapshot = createSnapshot(get());
    }

    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      if (typingSnapshot) {
        const state = get();
        const newPast = [...state.past, typingSnapshot].slice(-MAX_HISTORY);
        set({
          past: newPast,
          future: [],
          canUndo: true,
          canRedo: false,
        });
        typingSnapshot = null;
        typingTimer = null;
      }
    }, 650);
  };

  return {
    blocks: [],
    pages: [{ id: "p1", blockIds: [] }],
    activePageIndex: 0,
    selectedBlockId: null,
    focusedChapterId: null,
    lastCaretOffset: 0,
    sources: [],

    // --- PILAS DE HISTORIAL ---
    past: [],
    future: [],
    canUndo: false,
    canRedo: false,

    // --- ACCIÓN DESHACER (UNDO) ---
    undo: () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
        typingTimer = null;
        typingSnapshot = null;
      }

      const state = get();
      if (state.past.length === 0) return;

      const previousSnapshot = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      const currentSnapshot = createSnapshot(state);

      set({
        blocks: previousSnapshot.blocks,
        pages: previousSnapshot.pages,
        sources: previousSnapshot.sources,
        past: newPast,
        future: [currentSnapshot, ...state.future],
        canUndo: newPast.length > 0,
        canRedo: true,
      });
    },

    // --- ACCIÓN REHACER (REDO) ---
    redo: () => {
      const state = get();
      if (state.future.length === 0) return;

      const nextSnapshot = state.future[0];
      const newFuture = state.future.slice(1);
      const currentSnapshot = createSnapshot(state);
      const newPast = [...state.past, currentSnapshot].slice(-MAX_HISTORY);

      set({
        blocks: nextSnapshot.blocks,
        pages: nextSnapshot.pages,
        sources: nextSnapshot.sources,
        past: newPast,
        future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0,
      });
    },

    // --- NAVEGACIÓN ---
    setActivePage: (index) => set({ activePageIndex: index }),
    setSelectedBlockId: (id) =>
      set((state) => ({
        selectedBlockId: id,
        activePageIndex: id
          ? state.pages.findIndex((p) => p.blockIds.includes(id))
          : state.activePageIndex,
      })),
    setLastCaretOffset: (offset) => set({ lastCaretOffset: offset }),
    setFocusedChapterId: (id) => set({ focusedChapterId: id }),
    clearFocus: () => set({ focusedChapterId: null }),

    // --- ESCRITURA EN VIVO (Nivel 1: Palabras agrupadas) ---
    updateBlockContent: (id, content) => {
      registerTyping();
      set((state) => ({
        blocks: state.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
      }));
    },

    updateBlock: (id, updates) => {
      const isText = updates.title !== undefined || updates.note !== undefined;
      if (isText) {
        registerTyping();
        set((state) => ({
          blocks: state.blocks.map((b) =>
            b.id === id ? { ...b, ...updates } : b,
          ),
        }));
      } else {
        // Acciones discretas (cambiar ancho, filas, columnas, imágenes)
        set((state) => ({
          ...commitInstantSnapshot(state),
          blocks: state.blocks.map((b) =>
            b.id === id ? { ...b, ...updates } : b,
          ),
        }));
      }
    },

    // --- ACCIONES DE BLOQUES (Nivel 2: Snapshot Instantáneo) ---
    addBlock: (type = "paragraph") =>
      set((state) => {
        const history = commitInstantSnapshot(state);
        const newId = crypto.randomUUID();
        const { newBlock, newPages, newActiveIndex } =
          calculateNewBlockStructure({ type, state, newId });

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
          ...history,
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

    removeBlock: (id) =>
      set((state) => {
        const history = commitInstantSnapshot(state);
        const newBlocks = state.blocks.filter((b) => b.id !== id);
        const newPages = state.pages.map((page) => ({
          ...page,
          blockIds: page.blockIds.filter((blockId) => blockId !== id),
        }));
        const wasSelected = state.selectedBlockId === id;

        return {
          ...history,
          blocks: newBlocks,
          pages: newPages,
          ...(wasSelected && { selectedBlockId: null }),
        };
      }),

    splitBlock: (originalBlockId, textBefore, textAfter) =>
      set((state) => {
        const history = commitInstantSnapshot(state);
        const result = calculateSplit({
          blocks: state.blocks,
          pages: state.pages,
          blockId: originalBlockId,
          textBefore,
          textAfter,
        });

        return {
          ...history,
          blocks: result.updatedBlocks,
          pages: result.updatedPages,
          selectedBlockId: result.newBlockId,
        };
      }),

    mergeBlocks: (currentBlockId) =>
      set((state) => {
        const result = calculateMerge({ state, currentBlockId });
        if (!result) return state;

        const history = commitInstantSnapshot(state);
        return {
          ...history,
          blocks: result.updatedBlocks,
          pages: result.updatedPages,
          selectedBlockId: result.prevBlockId,
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

        const history = commitInstantSnapshot(state);
        return {
          ...history,
          blocks: result.currentBlocks,
          pages: result.currentPages,
          selectedBlockId: result.lastNewId,
        };
      }),

    moveToNextPage: (blockId) =>
      set((state) => {
        const fromPageIndex = state.pages.findIndex((p) =>
          p.blockIds.includes(blockId),
        );
        if (fromPageIndex === -1) return state;

        const history = commitInstantSnapshot(state);
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
          ...history,
          pages: newPages,
          activePageIndex: targetPageIndex,
          selectedBlockId: blockId,
        };
      }),

    // --- FUENTES Y CITAS ---
    addAndEditSource: (type) => {
      const { sources } = get();
      const emptySource = sources.find(
        (s) => !s.author && !s.title && s.type === type,
      );

      if (emptySource) {
        get().setSelectedSourceId(emptySource.id);
        return;
      }

      const history = commitInstantSnapshot(get());
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
        ...history,
        sources: [...state.sources, newSource],
      }));

      get().setSelectedSourceId(newId);
    },

    updateSource: (id, updates) =>
      set((state) => ({
        ...commitInstantSnapshot(state),
        sources: state.sources.map((s) =>
          s.id === id ? { ...s, ...updates } : s,
        ),
      })),

    removeSource: (id) =>
      set((state) => ({
        ...commitInstantSnapshot(state),
        sources: state.sources.filter((s) => s.id !== id),
      })),

    insertCitation: (
      blockId,
      sourceId,
      visualOffset,
      config = { type: "parenthetical", page: "" },
    ) =>
      set((state) => {
        const block = state.blocks.find((b) => b.id === blockId);
        if (!block) return state;

        const history = commitInstantSnapshot(state);
        const marker = `((ref:${sourceId}|type:${config.type}|page:${config.page}))`;
        const content = block.content || "";

        const regex = /\(\(ref:[\w-]+\|type:\w+\|page:.*?\)\)/g;
        let match;
        const markers = [];
        while ((match = regex.exec(content)) !== null) {
          const parts = match[0].replace("((", "").replace("))", "").split("|");
          const refId = parts[0].split(":")[1];
          const type = parts[1].split(":")[1];
          const page = parts[2].split(":")[1];

          const source = state.sources.find((s) => s.id === refId);
          const authors = (source?.author || "Anónimo").split(",")[0];
          const year = source?.year || "s.f.";
          const p = page ? `, p. ${page}` : "";
          const visualText =
            type === "narrative"
              ? `${authors} (${year}${p})`
              : `(${authors}, ${year}${p})`;

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
            finalLogicalIndex =
              lastMarkerEnd + (visualOffset - currentVisualPos);
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
          ...history,
          blocks: state.blocks.map((b) =>
            b.id === blockId ? { ...b, content: newContent } : b,
          ),
        };
      }),
  };
};

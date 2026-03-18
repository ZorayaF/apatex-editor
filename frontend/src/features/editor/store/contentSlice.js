import { calculateSplit } from "../logic/engine/insertionEngine";
import { cleanAndSplitText } from "../logic/engine/parser";

export const createContentSlice = (set, get) => ({
  // --- ESTADO ---
  blocks: [],
  pages: [{ id: "p1", blockIds: [] }],
  activePageIndex: 0,
  selectedBlockId: null,

  // --- NAVEGACIÓN Y SELECCIÓN ---
  setActivePage: (index) => set({ activePageIndex: index }),

  setSelectedBlockId: (id) =>
    set((state) => {
      if (!id) return { selectedBlockId: null };
      const pageIndex = state.pages.findIndex((p) => p.blockIds.includes(id));
      return {
        selectedBlockId: id,
        activePageIndex: pageIndex !== -1 ? pageIndex : state.activePageIndex,
      };
    }),

  // --- GESTIÓN DE BLOQUES ---
  addBlock: (type = "paragraph") =>
    set((state) => {
      const newId = crypto.randomUUID();
      const newBlock = { id: newId, type, content: "" };

      let newPages = [...state.pages];
      let newActiveIndex = state.activePageIndex;

      // --- LÓGICA PARA TÍTULOS PRINCIPALES (H1) ---
      // Mantenemos tu lógica de "una página por H1"
      if (type === "h1") {
        const currentPage = newPages[newActiveIndex];
        const hasH1 = currentPage.blockIds.some(
          (id) => state.blocks.find((b) => b.id === id)?.type === "h1",
        );

        if (!hasH1 && currentPage.blockIds.length === 0) {
          currentPage.blockIds = [newId];
        } else {
          const nextPageIndex = newActiveIndex + 1;
          if (!newPages[nextPageIndex]) {
            newPages.push({ id: crypto.randomUUID(), blockIds: [newId] });
          } else {
            newPages.splice(nextPageIndex, 0, {
              id: crypto.randomUUID(),
              blockIds: [newId],
            });
          }
          newActiveIndex = nextPageIndex;
        }
      }
      // --- LÓGICA CONTEXTUAL (H2, H3, H4, H5, Paragraph) ---
      else {
        const currentPage = { ...newPages[newActiveIndex] };
        const selectedId = state.selectedBlockId;
        const selectedIndex = currentPage.blockIds.indexOf(selectedId);

        if (selectedIndex !== -1) {
          // INSERCIÓN INTELIGENTE: Insertar justo debajo del bloque seleccionado
          currentPage.blockIds.splice(selectedIndex + 1, 0, newId);
        } else {
          // FALLBACK: Si no hay nada seleccionado, va al final
          currentPage.blockIds.push(newId);
        }
        newPages[newActiveIndex] = currentPage;
      }

      return {
        blocks: [...state.blocks, newBlock],
        pages: newPages,
        activePageIndex: newActiveIndex,
        selectedBlockId: newId, // <--- Esto dispara el useEffect en BaseEditable
      };
    }),

  updateBlockContent: (id, content) =>
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
    })),

  // --- LÓGICA DE ESCRITURA (ENTER) ---
  splitBlock: (originalBlockId, textBefore, textAfter) =>
    set((state) => {
      const { updatedBlocks, updatedPages, newBlockId } = calculateSplit({
        blocks: state.blocks,
        pages: state.pages,
        blockId: originalBlockId,
        textBefore,
        textAfter,
      });

      return {
        blocks: updatedBlocks,
        pages: updatedPages,
        selectedBlockId: newBlockId, // <--- El foco salta al nuevo bloque creado por Enter
      };
    }),

  // --- LÓGICA DE PEGADO ---
  handlePasteText: (rawText) =>
    set((state) => {
      const lines = cleanAndSplitText(rawText);
      if (lines.length === 0) return state;

      let currentBlocks = [...state.blocks];
      let currentPages = [...state.pages];
      let lastNewId = state.selectedBlockId;

      const activeBlock = currentBlocks.find(
        (b) => b.id === state.selectedBlockId,
      );
      const isCurrentEmpty = activeBlock && activeBlock.content.trim() === "";

      let linesToProcess = [...lines];

      if (isCurrentEmpty) {
        const firstLine = linesToProcess.shift();
        currentBlocks = currentBlocks.map((b) =>
          b.id === state.selectedBlockId ? { ...b, content: firstLine } : b,
        );
      }

      linesToProcess.forEach((line) => {
        const newId = crypto.randomUUID();
        currentBlocks.push({ id: newId, type: "paragraph", content: line });

        const page = currentPages[state.activePageIndex];
        const currentIndex = page.blockIds.indexOf(lastNewId);
        page.blockIds.splice(currentIndex + 1, 0, newId);

        lastNewId = newId;
      });

      return {
        blocks: currentBlocks,
        pages: currentPages,
        selectedBlockId: lastNewId, // <--- El foco salta a la última línea pegada
      };
    }),

  // --- LÓGICA DE PAGINACIÓN ---
  moveToNextPage: (blockId) =>
    set((state) => {
      const fromPageIndex = state.pages.findIndex((p) =>
        p.blockIds.includes(blockId),
      );
      if (fromPageIndex === -1) return state;

      const newPages = [...state.pages];
      newPages[fromPageIndex].blockIds = newPages[
        fromPageIndex
      ].blockIds.filter((id) => id !== blockId);

      if (!newPages[fromPageIndex + 1]) {
        newPages.push({ id: crypto.randomUUID(), blockIds: [] });
      }

      newPages[fromPageIndex + 1].blockIds = [
        blockId,
        ...newPages[fromPageIndex + 1].blockIds,
      ];

      return {
        pages: newPages,
        activePageIndex: fromPageIndex + 1,
        selectedBlockId: blockId, // Mantenemos la selección tras el salto
      };
    }),
});

import { calculateSmartInsertion } from '../logic/engine/insertionEngine';
import { BLOCK_RULES } from '../logic/rules/blockRules'; // <--- Nueva ruta correcta

export const createContentSlice = (set, get) => ({
  // --- ESTADO ---
  blocks: [
    { id: 'b1', type: 'h1', content: 'TÍTULO DE LA INVESTIGACIÓN' },
    { id: 'b2', type: 'paragraph', content: 'Este es un párrafo inicial.' },
  ],
  pages: [
    { id: 'p1', blockIds: ['b1', 'b2'] }
  ],
  activePageIndex: 0,
  selectedBlockId: null,

  // --- ACCIONES DE ESTRUCTURA ---

  addBlock: (type, content = '') => set((state) => {
    // 1. El motor calcula la posición ideal según tus 5 casos de H1
    const { updatedPages, targetPageIndex, newId } = calculateSmartInsertion({
      pages: state.pages,
      blocks: state.blocks,
      activePageIndex: state.activePageIndex,
      selectedBlockId: state.selectedBlockId,
      newBlockType: type,
      rules: BLOCK_RULES // Pasamos las reglas desde logic/rules
    });

    // 2. Registramos el nuevo objeto de datos
    const newBlock = { id: newId, type, content };

    return {
      blocks: [...state.blocks, newBlock],
      pages: updatedPages,
      selectedBlockId: newId,
      activePageIndex: targetPageIndex
    };
  }),

  deleteBlock: (id) => set((state) => ({
    blocks: state.blocks.filter(b => b.id !== id),
    pages: state.pages.map(page => ({
      ...page,
      blockIds: page.blockIds.filter(blockId => blockId !== id)
    })),
    // Si borramos el bloque que teníamos seleccionado, limpiamos la selección
    selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId
  })),

  // --- ACCIONES DE CONTENIDO Y UI ---

  updateBlock: (id, newContent) => set((state) => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, content: newContent } : b)
  })),

  setSelectedBlock: (id) => set({ selectedBlockId: id }),

  setActivePage: (index) => set({ activePageIndex: index }),
});

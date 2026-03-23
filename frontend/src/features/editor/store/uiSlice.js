export const createUiSlice = (set, get) => ({
  selectedBlockId: null,
  selectedSourceId: null, // <--- NUEVO: ID de la referencia en edición
  activePageIndex: 0,

  setActivePage: (index) => set({ activePageIndex: index }),

  // 1. Modificamos la selección de bloques para que limpie fuentes
  setSelectedBlockId: (id) =>
    set((state) => {
      if (!id) return { selectedBlockId: null };

      const pageIndex = state.pages.findIndex((p) => p.blockIds.includes(id));

      return {
        selectedBlockId: id,
        selectedSourceId: null, // <--- Limpiamos la fuente si tocamos un bloque
        activePageIndex: pageIndex !== -1 ? pageIndex : state.activePageIndex,
      };
    }),

  // 2. NUEVO: Acción para seleccionar una fuente (Referencia)
  setSelectedSourceId: (id) =>
    set({
      selectedSourceId: id,
      selectedBlockId: null, // <--- Limpiamos el bloque si editamos una fuente
    }),

  // 3. NUEVO: Limpiador total (útil para el estado vacío)
  clearSelection: () =>
    set({
      selectedBlockId: null,
      selectedSourceId: null,
    }),
});

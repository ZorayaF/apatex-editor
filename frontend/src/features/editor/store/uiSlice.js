export const createUiSlice = (set, get) => ({
  selectedBlockId: null,
  selectedSourceId: null,
  activePageIndex: 0,
  activeTab: "properties",

  setActivePage: (index) => set({ activePageIndex: index }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  // 1. Selección de bloques INDEPENDIENTE
  setSelectedBlockId: (id) =>
    set((state) => {
      if (!id) return { selectedBlockId: null };

      const pageIndex = state.pages.findIndex((p) => p.blockIds.includes(id));

      return {
        selectedBlockId: id,
        // YA NO LIMPIAMOS selectedSourceId.
        // Si el usuario está editando una fuente, la dejamos ahí.
        activePageIndex: pageIndex !== -1 ? pageIndex : state.activePageIndex,
      };
    }),

  // 2. Selección de fuentes INDEPENDIENTE
  setSelectedSourceId: (id) =>
    set({
      selectedSourceId: id,
      // YA NO LIMPIAMOS selectedBlockId.
      activeTab: "library", // Nos movemos a la pestaña de biblioteca
    }),

  // 3. NUEVO: Función para cerrar la edición de la fuente (el botón "Guardar/Volver")
  clearSourceSelection: () =>
    set({
      selectedSourceId: null,
    }),

  clearSelection: () =>
    set({
      selectedBlockId: null,
      selectedSourceId: null,
    }),
});

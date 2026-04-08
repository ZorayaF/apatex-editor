export const createUiSlice = (set, get) => ({
  selectedBlockId: null,
  selectedSourceId: null,
  activePageIndex: 0,
  activeTab: "properties",
  // Nuevo estado para controlar la visibilidad lateral
  isInspectorOpen: true,
  isNavbarOpen: true,

  setActivePage: (index) => set({ activePageIndex: index }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Acción para abrir/cerrar manualmente el panel
  setInspectorOpen: (open) => set({ isInspectorOpen: open }),
  setNavbarOpen: (open) => set({ isNavbarOpen: open }),
  setSelectedBlockId: (id) =>
    set((state) => {
      if (!id) return { selectedBlockId: null };

      const pageIndex = state.pages.findIndex((p) => p.blockIds.includes(id));

      // Verificamos si es un bloque que requiere atención en el inspector
      const block = state.blocks.find((b) => b.id === id);
      const isComplex = ["table", "figure"].includes(block?.type);

      return {
        selectedBlockId: id,
        activePageIndex: pageIndex !== -1 ? pageIndex : state.activePageIndex,
        // Si insertamos o tocamos tabla/figura, forzamos apertura y pestaña de diseño
        ...(isComplex && {
          activeTab: "properties",
          isInspectorOpen: true,
        }),
      };
    }),

  setSelectedSourceId: (id) =>
    set({
      selectedSourceId: id,
      activeTab: "library",
      // Siempre abrimos el inspector al editar una fuente
      isInspectorOpen: true,
    }),

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

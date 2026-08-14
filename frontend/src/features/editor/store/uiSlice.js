// src/features/editor/store/uiSlice.js
export const createUiSlice = (set, get) => ({
  selectedBlockId: null,
  selectedSourceId: null,
  activePageIndex: 0,
  activeTab: "properties",

  // Iniciar con paneles cerrados (espacio limpio de redacción)
  isInspectorOpen: false,
  isNavbarOpen: false,

  // Anchos redimensionables iniciales (en px)
  navbarWidth: 260,
  inspectorWidth: 320,

  // Control de Zoom (0.5 = 50%, 2.0 = 200%)
  zoom: 1.0,

  // Acciones de Zoom
  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.5), 2.0) }),
  zoomIn: () =>
    set((state) => ({
      zoom: Math.min(Number((state.zoom + 0.1).toFixed(1)), 2.0),
    })),
  zoomOut: () =>
    set((state) => ({
      zoom: Math.max(Number((state.zoom - 0.1).toFixed(1)), 0.5),
    })),
  resetZoom: () => set({ zoom: 1.0 }),

  // Acciones de Redimensionamiento (con límites seguros)
  setNavbarWidth: (width) =>
    set({ navbarWidth: Math.min(Math.max(width, 200), 450) }),
  setInspectorWidth: (width) =>
    set({ inspectorWidth: Math.min(Math.max(width, 260), 550) }),

  setActivePage: (index) => set({ activePageIndex: index }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  setInspectorOpen: (open) => set({ isInspectorOpen: open }),
  setNavbarOpen: (open) => set({ isNavbarOpen: open }),

  setSelectedBlockId: (id) =>
    set((state) => {
      if (!id) return { selectedBlockId: null };

      const pageIndex = state.pages.findIndex((p) => p.blockIds.includes(id));
      const block = state.blocks.find((b) => b.id === id);
      const isComplex = ["table", "figure"].includes(block?.type);

      return {
        selectedBlockId: id,
        activePageIndex: pageIndex !== -1 ? pageIndex : state.activePageIndex,
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
      isInspectorOpen: true,
    }),

  clearSourceSelection: () => set({ selectedSourceId: null }),
  clearSelection: () => set({ selectedBlockId: null, selectedSourceId: null }),
});

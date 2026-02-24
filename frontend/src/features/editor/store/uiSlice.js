export const createUiSlice = (set, get) => ({
  selectedBlockId: null,
  activePageIndex: 0,

  setActivePage: (index) => set({ activePageIndex: index }),

  setSelectedBlockId: (id) => set((state) => {
    if (!id) return { selectedBlockId: null };

    // Nota: 'state' aquí tiene acceso a TODO el store (incluyendo pages del otro slice)
    const pageIndex = state.pages.findIndex(p => p.blockIds.includes(id));

    return {
      selectedBlockId: id,
      activePageIndex: pageIndex !== -1 ? pageIndex : state.activePageIndex
    };
  }),
});

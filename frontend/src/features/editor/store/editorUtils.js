// Ayuda a clonar profundo para evitar mutaciones accidentales
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export const calculateBlockInsertion = (pages, blocks, activePageIndex, selectedBlockId, type, newId) => {
  // Clonamos para trabajar seguros
  const updatedPages = deepClone(pages);

  let targetPageIndex = activePageIndex;
  let insertIndex = updatedPages[targetPageIndex].blockIds.length;

  // 1. Ajuste por selección previa
  if (selectedBlockId) {
    const pIdx = updatedPages.findIndex(p => p.blockIds.includes(selectedBlockId));
    if (pIdx !== -1) {
      targetPageIndex = pIdx;
      insertIndex = updatedPages[pIdx].blockIds.indexOf(selectedBlockId) + 1;
    }
  }

  // 2. Lógica de Inteligencia para H1
  if (type === 'h1') {
    const currentPage = updatedPages[targetPageIndex];
    // Función helper interna
    const getType = (id) => blocks.find(b => b.id === id)?.type;

    const currentPageHasH1 = currentPage.blockIds.some(id => getType(id) === 'h1');

    if (!currentPageHasH1) {
      insertIndex = 0; // Reclama el inicio
    } else {
      const nextPageIndex = targetPageIndex + 1;
      const nextPage = updatedPages[nextPageIndex];

      if (!nextPage) {
        // Crear nueva pág al final
        updatedPages.push({ id: crypto.randomUUID(), blockIds: [] });
        targetPageIndex = nextPageIndex;
        insertIndex = 0;
      } else {
        const nextPageHasH1 = nextPage.blockIds.some(id => getType(id) === 'h1');
        if (!nextPageHasH1) {
          // Usar siguiente página existente
          targetPageIndex = nextPageIndex;
          insertIndex = 0;
        } else {
          // Insertar página intermedia
          updatedPages.splice(nextPageIndex, 0, { id: crypto.randomUUID(), blockIds: [] });
          targetPageIndex = nextPageIndex;
          insertIndex = 0;
        }
      }
    }
  }

  // 3. Inserción final del ID
  updatedPages[targetPageIndex].blockIds.splice(insertIndex, 0, newId);

  return { updatedPages, targetPageIndex };
};

// features/editor/logic/engine/insertionEngine.js

/**
 * FUNCIONES DE APOYO (HELPERS)
 * Las sacamos de la función principal para que el código sea más limpio.
 */
const getBlockType = (id, blocks) => blocks.find(b => b.id === id)?.type;

const pageHasType = (page, type, blocks) =>
  page.blockIds.some(id => getBlockType(id, blocks) === type);

const isPageEmpty = (page) => page.blockIds.length === 0;

/**
 * ACCIONES DE TRANSFORMACIÓN (INMUTABLES)
 * Estas funciones crean copias nuevas de los arrays.
 */

// Inserta al principio de una página específica
const insertAtStart = (pages, pageIdx, newId) => {
  const updatedPages = [...pages];
  const targetPage = { ...updatedPages[pageIdx] };
  targetPage.blockIds = [newId, ...targetPage.blockIds]; // El nuevo ID va primero
  updatedPages[pageIdx] = targetPage;

  return { updatedPages, targetPageIndex: pageIdx };
};

// Crea una página nueva e inserta el bloque ahí
const createPageAndInsert = (pages, insertAtIdx, newId) => {
  const updatedPages = [...pages];
  const newPage = {
    id: crypto.randomUUID(),
    blockIds: [newId]
  };
  // Insertamos la página en la posición deseada (en medio o al final)
  updatedPages.splice(insertAtIdx, 0, newPage);

  return { updatedPages, targetPageIndex: insertAtIdx };
};

// Inserta después del bloque seleccionado (lógica estándar para párrafos)
const insertAtSelection = (pages, pageIdx, selectedId, newId) => {
  const updatedPages = [...pages];
  const targetPage = { ...updatedPages[pageIdx] };

  const currentIds = [...targetPage.blockIds];
  const selectedIdx = currentIds.indexOf(selectedId);

  // Si hay algo seleccionado, inserta justo después. Si no, al final.
  const insertPos = selectedIdx !== -1 ? selectedIdx + 1 : currentIds.length;

  currentIds.splice(insertPos, 0, newId);
  targetPage.blockIds = currentIds;
  updatedPages[pageIdx] = targetPage;

  return { updatedPages, targetPageIndex: pageIdx };
};

/**
 * MOTOR PRINCIPAL
 */
export const calculateSmartInsertion = ({ pages, blocks, activePageIndex, selectedBlockId, newBlockType, rules }) => {
  const newId = crypto.randomUUID();
  const currentPage = pages[activePageIndex];
  const nextPage = pages[activePageIndex + 1];

  // --- LÓGICA DE ESCENARIOS PARA H1 ---

  if (newBlockType === 'h1') {
    const hasH1 = pageHasType(currentPage, 'h1', blocks);

    // CASO 1 & 2: No tiene H1 o está vacía -> Al inicio
    if (!hasH1 || isPageEmpty(currentPage)) {
      return { ...insertAtStart(pages, activePageIndex, newId), newId };
    }

    // CASO 3: Ya tiene H1, pero la siguiente está vacía -> Salta a la siguiente
    if (nextPage && isPageEmpty(nextPage)) {
      return { ...insertAtStart(pages, activePageIndex + 1, newId), newId };
    }

    // CASO 4: Hay conflicto (ambas tienen H1) o es la última página -> Crea página nueva
    return { ...createPageAndInsert(pages, activePageIndex + 1, newId), newId };
  }

  // --- CASO POR DEFECTO (Párrafos, etc.) ---
  return {
    ...insertAtSelection(pages, activePageIndex, selectedBlockId, newId),
    newId
  };
};

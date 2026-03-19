// features/editor/logic/engine/insertionEngine.js

/**
 * Calcula la nueva estructura tras dividir un bloque.
 */
export const calculateSplit = ({
  pages,
  blocks,
  blockId,
  textBefore,
  textAfter,
}) => {
  const newBlockId = crypto.randomUUID();

  // 1. Actualizar el contenido del bloque original
  const updatedBlocks = blocks.map((b) =>
    b.id === blockId ? { ...b, content: textBefore } : b,
  );

  // 2. Crear el nuevo bloque con la segunda mitad del texto
  updatedBlocks.push({
    id: newBlockId,
    type: "paragraph",
    content: textAfter,
  });

  // 3. Reordenar la página: Insertar el nuevo ID justo debajo del original
  const updatedPages = pages.map((page) => {
    if (page.blockIds.includes(blockId)) {
      const newIds = [...page.blockIds];
      const index = newIds.indexOf(blockId);
      newIds.splice(index + 1, 0, newBlockId);
      return { ...page, blockIds: newIds };
    }
    return page;
  });

  return { updatedBlocks, updatedPages, newBlockId };
};
// features/editor/logic/engine/insertionEngine.js

// Lógica que antes estaba dentro de addBlock
export const calculateNewBlockStructure = ({ type, state, newId }) => {
  const newBlock = { id: newId, type, content: "" };
  let newPages = JSON.parse(JSON.stringify(state.pages));
  let newActiveIndex = state.activePageIndex;

  if (type === "h1") {
    const currentPage = newPages[newActiveIndex];

    // Verificamos si ya existe un H1 en esta página
    const hasH1 = currentPage.blockIds.some(
      (id) => state.blocks.find((b) => b.id === id)?.type === "h1",
    );

    // REGLA 1 y 2: Si NO tiene H1 (esté vacía o con texto), se queda aquí e inserta al inicio
    if (!hasH1) {
      currentPage.blockIds = [newId, ...currentPage.blockIds];
    }
    // Si YA TIENE un H1, aplicamos las reglas de salto
    else {
      const nextPageIndex = newActiveIndex + 1;
      const nextPage = newPages[nextPageIndex];

      // REGLA 3: Si la siguiente existe y está vacía, saltamos a ella
      if (nextPage && nextPage.blockIds.length === 0) {
        nextPage.blockIds = [newId];
        newActiveIndex = nextPageIndex;
      }
      // REGLA 4: Si no hay siguiente o la siguiente tiene contenido, creamos una nueva en medio
      else {
        newPages.splice(nextPageIndex, 0, {
          id: crypto.randomUUID(),
          blockIds: [newId],
        });
        newActiveIndex = nextPageIndex;
      }
    }
  } else {
    // Lógica para el resto de bloques (H2-H5, P)
    const currentPage = newPages[newActiveIndex];
    const selectedIndex = currentPage.blockIds.indexOf(state.selectedBlockId);

    if (selectedIndex !== -1) {
      currentPage.blockIds.splice(selectedIndex + 1, 0, newId);
    } else {
      currentPage.blockIds.push(newId);
    }
  }

  return { newBlock, newPages, newActiveIndex };
};

// Lógica que antes estaba dentro de handlePasteText
export const calculatePasteStructure = ({
  rawText,
  state,
  cleanAndSplitText,
}) => {
  const lines = cleanAndSplitText(rawText);
  if (lines.length === 0) return null;

  let currentBlocks = [...state.blocks];
  let currentPages = JSON.parse(JSON.stringify(state.pages));

  // Empezamos insertando después del bloque actualmente seleccionado
  let lastId = state.selectedBlockId;
  let linesToProcess = [...lines];

  // Si el bloque actual está vacío, lo "llenamos" con la primera línea
  const activeBlock = currentBlocks.find((b) => b.id === lastId);
  if (activeBlock && activeBlock.content.trim() === "") {
    const firstLine = linesToProcess.shift();
    currentBlocks = currentBlocks.map((b) =>
      b.id === lastId ? { ...b, content: firstLine } : b,
    );
  }

  // El resto de líneas se convierten en nuevos bloques de párrafo
  linesToProcess.forEach((line) => {
    const newId = crypto.randomUUID();
    currentBlocks.push({ id: newId, type: "paragraph", content: line });

    const page = currentPages[state.activePageIndex];
    const currentIndex = page.blockIds.indexOf(lastId);

    // Insertamos justo debajo del anterior
    page.blockIds.splice(currentIndex + 1, 0, newId);
    lastId = newId;
  });

  return { currentBlocks, currentPages, lastNewId: lastId };
};

// features/editor/logic/engine/insertionEngine.js

/**
 * Calcula la nueva estructura tras dividir un bloque.
 */
export const calculateSplit = ({ pages, blocks, blockId, textBefore, textAfter }) => {
  const newBlockId = crypto.randomUUID();

  // 1. Actualizar el contenido del bloque original
  const updatedBlocks = blocks.map(b =>
    b.id === blockId ? { ...b, content: textBefore } : b
  );

  // 2. Crear el nuevo bloque con la segunda mitad del texto
  updatedBlocks.push({
    id: newBlockId,
    type: 'paragraph',
    content: textAfter
  });

  // 3. Reordenar la página: Insertar el nuevo ID justo debajo del original
  const updatedPages = pages.map(page => {
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

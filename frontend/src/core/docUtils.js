// Funciones puras: fáciles de probar y leer
export const splitBlockLogic = (blocks, id, cursorPosition) => {
  const index = blocks.findIndex(b => b.id === id);
  const currentBlock = blocks[index];

  const textBefore = currentBlock.content.slice(0, cursorPosition);
  const textAfter = currentBlock.content.slice(cursorPosition);

  const newBlock = {
    id: Date.now().toString(),
    type: 'p',
    content: textAfter
  };

  const newBlocks = [...blocks];
  newBlocks[index] = { ...currentBlock, content: textBefore };
  newBlocks.splice(index + 1, 0, newBlock);

  return newBlocks;
};

export const mergeBlocksLogic = (blocks, id) => {
  const index = blocks.findIndex(b => b.id === id);
  if (index === 0) return { newBlocks: blocks, targetCursor: null };

  const prevBlock = blocks[index - 1];
  const currentBlock = blocks[index];

  // Guardamos la posición donde estaba el final del bloque anterior
  const targetCursor = prevBlock.content.length;

  const newBlocks = [...blocks];
  newBlocks[index - 1] = {
    ...prevBlock,
    content: prevBlock.content + currentBlock.content
  };
  newBlocks.splice(index, 1);

  return {
    newBlocks,
    targetCursor,
    targetBlockId: prevBlock.id
  };
};

// logic/engine/selectionEngine.js

export const findPageIndexByBlockId = (pages, blockId) => {
  return pages.findIndex((page) => page.blockIds.includes(blockId));
};

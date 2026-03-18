// src/features/editor/logic/engine/numberingEngine.js

export const calculateBlockLabels = (pages, blocks) => {
  const labels = {};
  let h1Count = 0;
  let h2Count = 0;

  pages.forEach((page) => {
    page.blockIds.forEach((blockId) => {
      const block = blocks.find((b) => b.id === blockId);
      if (!block) return;

      if (block.type === "h1") {
        h1Count++;
        h2Count = 0; // REINICIO: Cada h1 pone a cero los h2
        labels[blockId] = `${h1Count}. `;
      } else if (block.type === "h2") {
        h2Count++;
        labels[blockId] = `${h1Count}.${h2Count} `;
      }
    });
  });

  return labels;
};

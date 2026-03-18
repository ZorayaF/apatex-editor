// src/features/editor/logic/engine/numberingEngine.js

export const calculateBlockLabels = (pages, blocks) => {
  const labels = {};
  let h1Count = 0;
  let h2Count = 0;
  let h3Count = 0; // Tercer nivel

  pages.forEach((page) => {
    page.blockIds.forEach((blockId) => {
      const block = blocks.find((b) => b.id === blockId);
      if (!block) return;

      if (block.type === "h1") {
        h1Count++;
        h2Count = 0; // Reinicia el nivel 2
        h3Count = 0; // Reinicia el nivel 3
        labels[blockId] = `${h1Count}. `;
      } else if (block.type === "h2") {
        h2Count++;
        h3Count = 0; // Reinicia el nivel 3 al cambiar de H2
        labels[blockId] = `${h1Count}.${h2Count} `;
      } else if (block.type === "h3") {
        h3Count++;
        labels[blockId] = `${h1Count}.${h2Count}.${h3Count} `;
      }
    });
  });

  return labels;
};

// @editor/logic/engine/formatting.js
export const formatRunInHeading = (text, blockType) => {
  if (!text) return "";
  const firstPointIndex = text.indexOf(".");

  if (firstPointIndex === -1) {
    return blockType === "h5" ? `<b><i>${text}</i></b>` : `<b>${text}</b>`;
  }

  const title = text.slice(0, firstPointIndex + 1);
  const body = text.slice(firstPointIndex + 1);

  return blockType === "h5"
    ? `<b><i>${title}</i></b>${body}`
    : `<b>${title}</b>${body}`;
};

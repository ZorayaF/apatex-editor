// @editor/hooks/useCaret.js
export const useCaret = (ref) => {
  const getOffset = () => {
    let position = 0;
    const selection = window.getSelection();
    if (selection.rangeCount !== 0 && ref.current) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(ref.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      position = preCaretRange.toString().length;
    }
    return position;
  };

  const setOffset = (offset) => {
    if (!ref.current) return;
    const range = document.createRange();
    const sel = window.getSelection();
    let charCount = 0;
    let nodeStack = [ref.current];
    let node,
      found = false;

    while (!found && (node = nodeStack.pop())) {
      if (node.nodeType === 3) {
        const nextCharCount = charCount + node.length;
        if (offset <= nextCharCount) {
          range.setStart(node, offset - charCount);
          range.collapse(true);
          found = true;
        }
        charCount = nextCharCount;
      } else {
        let i = node.childNodes.length;
        while (i--) nodeStack.push(node.childNodes[i]);
      }
    }
    sel.removeAllRanges();
    sel.addRange(range);
  };

  return { getOffset, setOffset };
};

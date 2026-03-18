import React, { useRef, useEffect } from "react";
import { useStore } from "@store";
import { DOCUMENT_THEME } from "@editor/logic/rules/documentStyles";

export const BaseEditable = ({
  id,
  content,
  type,
  label,
  tag: Tag = "div",
  style,
  className,
}) => {
  const textRef = useRef(null);
  const isTyping = useRef(false);

  const updateBlockContent = useStore((state) => state.updateBlockContent);
  const setSelectedBlockId = useStore((state) => state.setSelectedBlockId);
  const selectedBlockId = useStore((state) => state.selectedBlockId);
  const splitBlock = useStore((state) => state.splitBlock);

  // --- 1. UTILIDADES DE CURSOR ABSOLUTO (EL REPARADOR) ---
  const getCaretOffset = (element) => {
    let position = 0;
    const selection = window.getSelection();
    if (selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      position = preCaretRange.toString().length;
    }
    return position;
  };

  const setCaretOffset = (element, offset) => {
    const range = document.createRange();
    const sel = window.getSelection();
    let charCount = 0;
    let nodeStack = [element];
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

  // --- 2. FORMATEADOR UNIFICADO (H4 y H5) ---
  const formatRunInHeading = (text, blockType) => {
    if (!text) return "";
    const firstPointIndex = text.indexOf(".");

    if (firstPointIndex === -1) {
      // Caso: Escribiendo el título (todavía no hay punto)
      return blockType === "h5" ? `<b><i>${text}</i></b>` : `<b>${text}</b>`;
    }

    // Caso: Título con punto + Párrafo normal
    const title = text.slice(0, firstPointIndex + 1);
    const body = text.slice(firstPointIndex + 1);

    return blockType === "h5"
      ? `<b><i>${title}</i></b>${body}`
      : `<b>${title}</b>${body}`;
  };

  // --- 3. EFECTOS ---
  useEffect(() => {
    // Si este bloque es el seleccionado y no tiene el foco actual...
    if (selectedBlockId === id && textRef.current) {
      // Usamos requestAnimationFrame para esperar al siguiente ciclo de renderizado
      requestAnimationFrame(() => {
        if (document.activeElement !== textRef.current) {
          textRef.current.focus();

          // Mover el cursor al inicio (para bloques nuevos vacíos)
          // o al final (si ya tiene contenido)
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(textRef.current);
          range.collapse(false); // false = al final, true = al inicio
          sel.removeAllRanges();
          sel.addRange(range);
        }
      });
    }
  }, [selectedBlockId, id]); // Se dispara cada vez que cambia el bloque seleccionado

  // --- 4. HANDLERS ---
  const handleInput = () => {
    isTyping.current = true;
    const isRunIn = type === "h4" || type === "h5";

    // Guardamos posición absoluta antes de cualquier cambio en el DOM
    const offset = getCaretOffset(textRef.current);
    const rawText = textRef.current.innerText;

    updateBlockContent(id, rawText);

    if (isRunIn) {
      textRef.current.innerHTML = formatRunInHeading(rawText, type);
      // Restauramos posición absoluta (ya no importa cuántos nodos <b> o <i> haya)
      setCaretOffset(textRef.current, offset);
    }

    setTimeout(() => (isTyping.current = false), 10);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const offset = getCaretOffset(textRef.current);
      const fullText = textRef.current.innerText;
      splitBlock(id, fullText.slice(0, offset), fullText.slice(offset));
    }
  };

  const blockStyle = DOCUMENT_THEME.blocks[type] || {};
  const isCentered = blockStyle.textAlign === "center";

  return (
    <Tag
      className={className}
      onClick={() => setSelectedBlockId(id)}
      style={{
        ...DOCUMENT_THEME.global,
        ...blockStyle,
        ...style,
        outline: "none",
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: isCentered ? "center" : "flex-start",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {label && (
        <span
          contentEditable={false}
          style={{
            userSelect: "none",
            marginRight: "1.5ch",
            fontWeight: "bold",
          }}
        >
          {label}
        </span>
      )}

      <span
        ref={textRef}
        contentEditable
        suppressContentEditableWarning
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onFocus={() => setSelectedBlockId(id)}
        style={{
          outline: "none",
          flex: isCentered ? "initial" : 1,
          textAlign: blockStyle.textAlign,
          minWidth: "10px",
        }}
      />
    </Tag>
  );
};

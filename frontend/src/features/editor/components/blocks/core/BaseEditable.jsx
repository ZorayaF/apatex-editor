import React, { useRef, useEffect } from "react";
import { useStore } from "@store";
import { DOCUMENT_THEME } from "@editor/logic/rules/documentStyles";

export const BaseEditable = ({
  id,
  content,
  type,
  label,
  tag: Tag = "div", // Se usa abajo como <Tag>
  style,
  className,
}) => {
  const textRef = useRef(null);
  const isTyping = useRef(false);

  const splitBlock = useStore((state) => state.splitBlock);
  const handlePasteText = useStore((state) => state.handlePasteText);
  const updateBlockContent = useStore((state) => state.updateBlockContent);
  const selectedBlockId = useStore((state) => state.selectedBlockId);
  const setSelectedBlockId = useStore((state) => state.setSelectedBlockId);

  // Sincronización de contenido
  useEffect(() => {
    if (textRef.current && !isTyping.current) {
      if (textRef.current.innerText !== content) {
        textRef.current.innerText = content;
      }
    }
  }, [content]);

  // Gestión de foco
  useEffect(() => {
    if (
      selectedBlockId === id &&
      textRef.current &&
      document.activeElement !== textRef.current
    ) {
      textRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(textRef.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [selectedBlockId, id]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(textRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);

      const cursorPosition = preCaretRange.toString().length;
      const fullText = textRef.current.innerText;

      splitBlock(
        id,
        fullText.slice(0, cursorPosition),
        fullText.slice(cursorPosition),
      );
    }
  };

  const handleInput = () => {
    isTyping.current = true;
    updateBlockContent(id, textRef.current.innerText);
    setTimeout(() => (isTyping.current = false), 10);
  };

  // --- LÓGICA DE ESTILOS DINÁMICOS ---
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
        // USO DE ISCENTERED: Si es centrado, agrupamos número y texto al medio
        justifyContent: isCentered ? "center" : "flex-start",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        position: "relative",
      }}
    >
      {/* NÚMERO (No editable) */}
      {label && (
        <span
          contentEditable={false}
          style={{
            userSelect: "none",
            marginRight: "1.5ch", // El espacio que querías
            fontWeight: "bold",
            flexShrink: 0,
            pointerEvents: "none",
          }}
        >
          {label}
        </span>
      )}

      {/* ÁREA DE TEXTO (Editable) */}
      <span
        ref={textRef}
        contentEditable
        suppressContentEditableWarning
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onFocus={() => setSelectedBlockId(id)}
        style={{
          outline: "none",
          // USO DE ISCENTERED: Si es centrado, no dejamos que crezca (flex: initial)
          // para que no se separe del número.
          flex: isCentered ? "initial" : 1,
          textAlign: blockStyle.textAlign,
          minWidth: "10px",
        }}
      />
    </Tag>
  );
};

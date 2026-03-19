import React, { useRef, useEffect } from "react";
import { useStore } from "@store";
import { useCaret } from "@editor/hooks/useCaret";
import { formatRunInHeading } from "@editor/logic/engine/formatting";
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

  // Hooks personalizados y Store
  const { getOffset, setOffset } = useCaret(textRef);
  const {
    updateBlockContent,
    setSelectedBlockId,
    selectedBlockId,
    splitBlock,
    handlePasteText,
  } = useStore();

  // --- EFECTOS ---

  // Sincronización inicial y actualizaciones externas
  useEffect(() => {
    if (textRef.current && !isTyping.current) {
      const isRunIn = type === "h4" || type === "h5";
      if (isRunIn) {
        textRef.current.innerHTML = formatRunInHeading(content, type);
      } else {
        textRef.current.innerText = content;
      }
    }
  }, [content, type]);

  // Gestión de foco
  useEffect(() => {
    if (selectedBlockId === id && textRef.current) {
      requestAnimationFrame(() => {
        if (document.activeElement !== textRef.current) {
          textRef.current.focus();
          // Mover al final por defecto
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(textRef.current);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      });
    }
  }, [selectedBlockId, id]);

  // --- HANDLERS ---
  const handleInput = () => {
    isTyping.current = true;
    const offset = getOffset();
    const rawText = textRef.current.innerText;

    updateBlockContent(id, rawText);

    if (type === "h4" || type === "h5") {
      textRef.current.innerHTML = formatRunInHeading(rawText, type);
      setOffset(offset);
    }

    setTimeout(() => (isTyping.current = false), 10);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const offset = getOffset();
      const fullText = textRef.current.innerText;
      splitBlock(id, fullText.slice(0, offset), fullText.slice(offset));
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();

    // Extraemos el texto plano directamente (el navegador hace el trabajo sucio)
    const plainText = e.clipboardData.getData("text/plain");

    // Enviamos al store
    handlePasteText(plainText);
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
        alignItems: "baseline",
        justifyContent: isCentered ? "center" : "flex-start",
        whiteSpace: "pre-wrap",
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
        onPaste={handlePaste}
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

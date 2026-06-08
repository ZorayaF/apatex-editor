// src/features/editor/components/blocks/core/BaseEditable.jsx
import React, { useRef } from "react";
import { useStore } from "@store";
import { useCaret } from "@hooks/useCaret";
import { useBlockSync } from "@hooks/useBlockSync";
import { useBlockHandlers } from "@hooks/useBlockHandlers";
import { DOCUMENT_THEME } from "@logic/rules/documentStyles";

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

  const caret = useCaret(textRef);
  const { selectedBlockId, handlePasteText } = useStore();

  // 1. Conectar lógica de sincronización (Pasiva: Store -> DOM)
  useBlockSync({
    id,
    textRef,
    content,
    type,
    selectedBlockId,
    isTyping,
    setAtEnd: caret.setAtEnd,
  });

  // 2. Conectar lógica de eventos (Activa: DOM -> Store)
  const { handleInput, handleKeyDown, handleFocus, handleKeyUp, handleClick } =
    useBlockHandlers({
      id,
      type,
      textRef,
      isTyping,
      caret,
      content,
    });

  // 3. Estilos calculados
  const blockStyle = DOCUMENT_THEME.blocks[type] || {};
  const isCentered = blockStyle.textAlign === "center";

  return (
    <Tag
      className={className}
      onClick={handleFocus}
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
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onKeyUp={handleKeyUp}
        onClick={handleClick}
        // --- LA RED DE SEGURIDAD ---
        // Si el usuario cambia de pestaña, forzamos un último guardado
        onBlur={handleInput}
        // ---------------------------

        onPaste={(e) => {
          e.preventDefault();
          handlePasteText(e.clipboardData.getData("text/plain"));
        }}
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

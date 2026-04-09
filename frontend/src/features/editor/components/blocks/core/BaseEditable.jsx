// src/features/editor/components/blocks/core/BaseEditable.jsx
import React, { useRef } from "react";
import { useStore } from "@store";
import { useCaret } from "@editor/hooks/useCaret";
import { useBlockSync } from "@editor/hooks/useBlockSync";
import { useBlockHandlers } from "@editor/hooks/useBlockHandlers";
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
  // Añadimos handleKeyUp y handleClick para el rastreo del cursor
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
        // --- NUEVOS HANDLERS PARA CITAS ---
        onKeyUp={handleKeyUp} // Rastrea posición al usar flechas
        onClick={handleClick} // Rastrea posición al hacer clic
        // ----------------------------------

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

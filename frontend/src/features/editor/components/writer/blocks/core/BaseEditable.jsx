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
  type = "paragraph",
  label,
  tag: Tag = "div",
  style,
  className,
}) => {
  const textRef = useRef(null);
  const isTyping = useRef(false);

  const caret = useCaret(textRef);
  const {
    selectedBlockId,
    handlePasteText,
    setSelectedSourceId,
    setActiveTab,
    setInspectorOpen,
  } = useStore();

  // 1. Sincronización (Store -> DOM)
  useBlockSync({
    id,
    textRef,
    content,
    type,
    selectedBlockId,
    isTyping,
    setAtEnd: caret.setAtEnd,
  });

  // 2. Eventos de bloque (DOM -> Store)
  const { handleInput, handleKeyDown, handleFocus, handleKeyUp, handleClick } =
    useBlockHandlers({
      id,
      type,
      textRef,
      isTyping,
      caret,
      content,
    });

  // Redirige el clic en el contenedor externo directamente al span editable
  const handleContainerClick = (e) => {
    if (e.target !== textRef.current && textRef.current) {
      textRef.current.focus();
    }
  };

  // 3. Interceptor de clics: detecta si se hizo clic sobre una cita APA
  const handleEditableClick = (e) => {
    const citationEl = e.target.closest("[data-ref-id]");

    if (citationEl) {
      const refId = citationEl.getAttribute("data-ref-id");

      if (refId) {
        setSelectedSourceId(refId);
        setActiveTab("library");
        if (typeof setInspectorOpen === "function") {
          setInspectorOpen(true);
        }
      }
    }

    handleClick(e);
  };

  // 4. Estilos calculados
  const blockStyle = DOCUMENT_THEME.blocks?.[type] || {};
  const isCentered = blockStyle.textAlign === "center";

  return (
    <Tag
      className={className}
      onClick={handleContainerClick}
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
        onClick={handleEditableClick}
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

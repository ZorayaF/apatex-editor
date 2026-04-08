// src/features/editor/components/blocks/core/BaseEditable.jsx
import React, { useRef, useEffect, useCallback } from "react";
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

  const { getOffset, setOffset, setAtEnd } = useCaret(textRef);
  const {
    updateBlockContent,
    setSelectedBlockId,
    selectedBlockId,
    splitBlock,
    handlePasteText,
    mergeBlocks,
  } = useStore();

  // --- SINCRONIZACIÓN DE CONTENIDO ---
  useEffect(() => {
    // Solo actualizamos el DOM si NO estamos escribiendo y el contenido cambió
    if (textRef.current && !isTyping.current) {
      const isRunIn = type === "h4" || type === "h5";
      const newHTML = isRunIn ? formatRunInHeading(content, type) : content;

      // Guardia para evitar layouts innecesarios
      if (textRef.current.innerHTML !== newHTML) {
        if (isRunIn) textRef.current.innerHTML = newHTML;
        else textRef.current.innerText = content;
      }
    }
  }, [content, type]);

  // --- GESTIÓN DE FOCO (EL PUNTO CRÍTICO) ---
  useEffect(() => {
    if (selectedBlockId === id && textRef.current) {
      // Solo enfocamos si el navegador no tiene ya el foco aquí
      if (document.activeElement !== textRef.current) {
        const frameId = requestAnimationFrame(() => {
          if (textRef.current) {
            textRef.current.focus();
            if (typeof setAtEnd === "function") setAtEnd();
          }
        });
        return () => cancelAnimationFrame(frameId);
      }
    }
  }, [selectedBlockId, id, setAtEnd]);

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

    // Aumentamos un poco el margen para asegurar que el Store se estabilice
    setTimeout(() => (isTyping.current = false), 50);
  };

  const handleFocus = useCallback(() => {
    // GUARDIA: Solo notificamos al store si no somos ya el bloque seleccionado
    if (selectedBlockId !== id) {
      setSelectedBlockId(id);
    }
  }, [id, selectedBlockId, setSelectedBlockId]);

  const handleKeyDown = (e) => {
    const offset = getOffset();
    const fullText = textRef.current.innerText;

    if (e.key === "Enter") {
      e.preventDefault();
      splitBlock(id, fullText.slice(0, offset), fullText.slice(offset));
    }

    if (e.key === "Backspace" && offset === 0) {
      e.preventDefault();
      mergeBlocks(id);
    }
  };

  const blockStyle = DOCUMENT_THEME.blocks[type] || {};
  const isCentered = blockStyle.textAlign === "center";

  return (
    <Tag
      className={className}
      onClick={handleFocus} // Usamos la misma lógica de guardia
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
        onPaste={(e) => {
          e.preventDefault();
          handlePasteText(e.clipboardData.getData("text/plain"));
        }}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onFocus={handleFocus} // <--- Handler con guardia
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

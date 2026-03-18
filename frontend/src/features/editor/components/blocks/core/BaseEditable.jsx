import React, { useRef, useEffect } from 'react';
import { useStore } from '@store';
import { DOCUMENT_THEME } from '@editor/logic/rules/documentStyles';

export const BaseEditable = ({ id, content, type, tag: Tag = 'div', style, className }) => {
  const ref = useRef(null);
  const isTyping = useRef(false);

  // Acciones del Store
  const splitBlock = useStore((state) => state.splitBlock);
  const handlePasteText = useStore((state) => state.handlePasteText);
  const updateBlockContent = useStore((state) => state.updateBlockContent);
  const selectedBlockId = useStore((state) => state.selectedBlockId);
  const setSelectedBlockId = useStore((state) => state.setSelectedBlockId);

  // 1. SINCRONIZACIÓN DE CONTENIDO
  // Evita que el cursor salte al actualizar el estado desde el teclado
  useEffect(() => {
    if (ref.current && !isTyping.current) {
      if (ref.current.innerText !== content) {
        ref.current.innerText = content;
      }
    }
  }, [content]);

  // 2. GESTIÓN DE FOCO Y CURSOR
  useEffect(() => {
    if (selectedBlockId === id && ref.current && document.activeElement !== ref.current) {
      ref.current.focus();

      // Mover cursor al final del texto al recibir foco
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [selectedBlockId, id]);

  // 3. MANEJO DE TECLAS (ENTER PARA DIVIDIR)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      // Medición robusta de la posición del cursor (Caret)
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(ref.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);

      const cursorPosition = preCaretRange.toString().length;
      const fullText = ref.current.innerText;

      const textBefore = fullText.slice(0, cursorPosition);
      const textAfter = fullText.slice(cursorPosition);

      splitBlock(id, textBefore, textAfter);
    }
  };

  // 4. MANEJO DE PEGADO (TEXTO PLANO)
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    handlePasteText(text);
  };

  // 5. ACTUALIZACIÓN AL ESCRIBIR
  const handleInput = () => {
    isTyping.current = true;
    updateBlockContent(id, ref.current.innerText);

    // Pequeño delay para permitir que el estado de React se estabilice
    setTimeout(() => {
      isTyping.current = false;
    }, 10);
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onInput={handleInput}
      onFocus={() => setSelectedBlockId(id)}
      className={className}
      style={{
        ...DOCUMENT_THEME.global,
        ...(DOCUMENT_THEME.blocks[type] || {}), // Aplica estilos por tipo (h1 o paragraph)
        ...style, // Overrides manuales
        outline: 'none',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    />
  );
};

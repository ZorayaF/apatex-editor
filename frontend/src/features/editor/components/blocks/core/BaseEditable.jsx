import React, { useRef, useEffect } from 'react';
import { useStore } from '@store';
import { DOCUMENT_THEME } from '@editor/logic/rules/documentStyles';

export const BaseEditable = ({ id, content, tag: Tag = 'div', style, className }) => {
  const ref = useRef(null);
  const isTyping = useRef(false);
  // Acciones del Store
  const splitBlock = useStore((state) => state.splitBlock);
  const handlePasteText = useStore((state) => state.handlePasteText);
  const updateBlockContent = useStore((state) => state.updateBlockContent);
  const selectedBlockId = useStore((state) => state.selectedBlockId);
  const setSelectedBlock = useStore((state) => state.setSelectedBlock);

  // 1. AUTO-FOCO: Si este bloque es el seleccionado, le damos el foco real
  useEffect(() => {
    // Solo actualizamos el DOM si el cambio viene de fuera (no por el teclado)
    if (ref.current && ref.current.innerText !== content && !isTyping.current) {
      ref.current.innerText = content;
    }
  }, [content]);

  useEffect(() => {
    if (selectedBlockId === id && ref.current) {
      ref.current.focus();

      // Mover cursor al final del texto
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(ref.current);
      range.collapse(false); // false significa "al final"
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [selectedBlockId, id]);

  // 2. MANEJO DE ENTER (División)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const selection = window.getSelection();
      const cursorPosition = selection.anchorOffset;
      const fullText = ref.current.innerText;

      const textBefore = fullText.slice(0, cursorPosition);
      const textAfter = fullText.slice(cursorPosition);

      splitBlock(id, textBefore, textAfter);
    }
  };

  // 3. MANEJO DE PEGADO (Limpieza)
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    handlePasteText(text);
  };

  // 4. SINCRONIZACIÓN SIMPLE (Escritura)
  const handleInput = () => {
    isTyping.current = true; // Bloqueamos la actualización desde props
    updateBlockContent(id, ref.current.innerText);

    // Liberamos el escudo después de un microsegundo
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
      onFocus={() => setSelectedBlock(id)}
      style={{
        ...DOCUMENT_THEME.global,
        ...style,
        outline: 'none',
        whiteSpace: 'pre-wrap',
      }}
      className={className}
    >
      {/* IMPORTANTE: Dejamos el contenido vacío aquí 
         y dejamos que el useEffect lo gestione al montar.
      */}
    </Tag>
  );
};

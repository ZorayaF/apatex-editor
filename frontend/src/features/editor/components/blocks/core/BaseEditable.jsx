import { useRef, useEffect } from 'react';
import { useStore } from '@store'; // Tu store de Zustand
import { DOCUMENT_THEME } from '@editor/logic/rules/documentStyles';

export const BaseEditable = ({ id, content, tag: Tag = 'div', style, placeholder, className }) => {
  const ref = useRef(null);
  const updateBlock = useStore((state) => state.updateBlock);
  const addBlock = useStore((state) => state.addBlock);
  const deleteBlock = useStore((state) => state.deleteBlock);

  // Sincronizar el cursor y el contenido inicial
  useEffect(() => {
    if (ref.current && ref.current.innerText !== content) {
      ref.current.innerText = content;
    }
  }, [id]); // Solo cuando cambia el bloque, no en cada tecla

  const handleInput = (e) => {
    updateBlock(id, e.currentTarget.innerText);
  };

  const handleKeyDown = (e) => {
    // Atajo: Enter para nuevo párrafo
    if (e.key === 'Enter') {
      e.preventDefault();
      addBlock('paragraph');
    }

    // Atajo: Backspace en bloque vacío para borrarlo
    if (e.key === 'Backspace' && ref.current.innerText === '') {
      e.preventDefault();
      deleteBlock(id);
    }
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      style={{
        ...DOCUMENT_THEME.global, // Aplicamos tipografía global
        ...style                  // Aplicamos estilo específico del bloque
      }}
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={`outline-none focus:ring-0 ${className}`}
      data-placeholder={placeholder}
    />
  );
};

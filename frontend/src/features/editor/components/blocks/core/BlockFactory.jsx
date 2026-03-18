import React from 'react';
// IMPORTANTE: Esta es la pieza que faltaba
import { BaseEditable } from './BaseEditable';

/**
 * Fábrica de bloques: Decide qué componente renderizar según el tipo.
 * Pasa el 'type' a BaseEditable para que este aplique los estilos 
 * automáticos de DOCUMENT_THEME.
 */
export const BlockFactory = ({ block }) => {
  if (!block) return null;

  switch (block.type) {
    case 'h1':
      return (
        <BaseEditable
          id={block.id}
          content={block.content}
          type="h1"           // Para que BaseEditable busque estilos de h1
          tag="h1"           // El tag HTML real
          className="editable-h1" // Para el contador y la primera letra en CSS
        />
      );

    case 'paragraph':
      return (
        <BaseEditable
          id={block.id}
          content={block.content}
          type="paragraph"    // Para que BaseEditable busque estilos de párrafo
          tag="p"             // El tag HTML real
        />
      );

    default:
      console.warn(`Tipo de bloque no reconocido: ${block.type}`);
      return null;
  }
};

import React from "react";
import { BaseEditable } from "./BaseEditable";

/**
 * Fábrica de bloques: Determina qué componente renderizar.
 * @param {Object} block - Datos del bloque (id, type, content).
 * @param {string} label - El número calculado por JS (ej: "1.1 ").
 */
export const BlockFactory = ({ block, label }) => {
  if (!block) return null;

  switch (block.type) {
    case "h1":
      return (
        <BaseEditable
          id={block.id}
          content={block.content}
          type="h1"
          tag="h1"
          label={label} // <--- Recibe "1. ", "2. ", etc.
        />
      );

    case "h2":
      return (
        <BaseEditable
          id={block.id}
          content={block.content}
          type="h2"
          tag="h2"
          label={label} // <--- Recibe "1.1 ", "1.2 ", etc.
        />
      );

    case "paragraph":
      return (
        <BaseEditable
          id={block.id}
          content={block.content}
          type="paragraph"
          tag="p"
          // Los párrafos no suelen llevar label, pero BaseEditable
          // lo manejará como null internamente.
        />
      );

    default:
      console.warn(`Tipo de bloque no reconocido: ${block.type}`);
      return null;
  }
};

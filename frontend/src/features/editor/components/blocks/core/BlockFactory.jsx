// src/features/editor/components/blocks/core/BlockFactory.jsx
import React from "react";
import { BLOCK_COMPONENTS, BLOCK_CONFIGS } from "./BlockRegistry";

export const BlockFactory = ({ block, label }) => {
  if (!block) return null;

  const Component = BLOCK_COMPONENTS[block.type];
  const config = BLOCK_CONFIGS[block.type] || {};

  if (!Component) return null;

  // --- LÓGICA DE ETIQUETA UNIFICADA ---
  // 1. Si es bullet, mostramos el punto.
  // 2. Si es encabezado (h1-h5), mostramos el número (label).
  // 3. Si es párrafo, mostramos null.
  const finalLabel =
    block.type === "bullet" ? "•" : block.type.startsWith("h") ? label : null;

  return (
    <Component
      id={block.id}
      content={block.content}
      type={block.type}
      tag={config.tag || "div"}
      label={finalLabel} // <--- Solo un atributo 'label'
    />
  );
};

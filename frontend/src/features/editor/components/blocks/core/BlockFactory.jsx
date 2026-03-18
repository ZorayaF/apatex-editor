// src/features/editor/components/blocks/core/BlockFactory.jsx
import React from "react";
import { BLOCK_COMPONENTS, BLOCK_CONFIGS } from "./BlockRegistry";

export const BlockFactory = ({ block, label }) => {
  if (!block) return null;

  // 1. Buscamos el componente en el registro
  const Component = BLOCK_COMPONENTS[block.type];

  // 2. Buscamos su configuración (tag, etc.)
  const config = BLOCK_CONFIGS[block.type] || {};

  if (!Component) {
    console.warn(`[BlockFactory] No hay componente para: ${block.type}`);
    return null;
  }

  // 3. Renderizado limpio
  return (
    <Component
      id={block.id}
      content={block.content}
      type={block.type}
      tag={config.tag || "div"}
      label={block.type.startsWith("h") ? label : null}
    />
  );
};

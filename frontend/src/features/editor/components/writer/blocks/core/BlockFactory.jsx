// src/features/editor/components/blocks/core/BlockFactory.jsx
import React from "react";
import { BLOCK_COMPONENTS, BLOCK_CONFIGS } from "./BlockRegistry";

export const BlockFactory = ({ block, label }) => {
  if (!block) return null;

  const Component = BLOCK_COMPONENTS[block.type];
  const config = BLOCK_CONFIGS[block.type] || {};

  if (!Component) return null;

  const finalLabel =
    block.type === "bullet" ? "•" : block.type.startsWith("h") ? label : null;

  // ✅ DEVOLVEMOS SOLO EL COMPONENTE
  // Ya no envolvemos en <BlockWrapper> aquí porque ConnectedBlock ya lo hace.
  return <Component {...block} tag={config.tag || "div"} label={finalLabel} />;
};

// src/features/editor/components/header/ObjectGroup.jsx
import React from "react";
import { Group } from "@mantine/core";
import { IconPhoto, IconTable } from "@tabler/icons-react";
import { useStore } from "@store";
import { HeaderButton } from "../HeaderButton";

export const ObjectGroup = () => {
  const {
    addBlock,
    setActiveTab,
    setInspectorOpen,
    setSelectedSourceId,
    selectedBlockId,
    blocks = [],
  } = useStore();

  const activeBlock = blocks.find((b) => b.id === selectedBlockId);
  const isFigureActive = activeBlock?.type === "figure";
  const isTableActive = activeBlock?.type === "table";

  const handleAddBlock = (type) => {
    setSelectedSourceId(null); // Limpia referencias activas
    addBlock(type);
    setActiveTab("properties");
    setInspectorOpen(true); // Garantiza que el inspector esté visible
  };

  return (
    <Group gap={4}>
      <HeaderButton
        label="Imagen"
        description="Insertar figura o imagen"
        icon={IconPhoto}
        onClick={() => handleAddBlock("figure")}
        isActive={isFigureActive}
      />
      <HeaderButton
        label="Tabla"
        description="Insertar tabla APA"
        icon={IconTable}
        onClick={() => handleAddBlock("table")}
        isActive={isTableActive}
      />
    </Group>
  );
};

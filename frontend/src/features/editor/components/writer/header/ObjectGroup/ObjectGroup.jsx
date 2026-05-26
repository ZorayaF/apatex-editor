// src/features/editor/components/header/ObjectGroup.jsx
import React from "react";
import { Group } from "@mantine/core";
import { IconPhoto, IconTable } from "@tabler/icons-react";
import { useStore } from "@store";
import { HeaderButton } from "../HeaderButton";

export const ObjectGroup = () => {
  const { addBlock, setActiveTab, setInspectorOpen } = useStore();

  const handleAddBlock = (type) => {
    addBlock(type);
    setActiveTab("properties");
    setInspectorOpen(true);
  };

  return (
    <Group gap={4}>
      <HeaderButton
        label="Imagen"
        description="Insertar figura o imagen"
        icon={IconPhoto}
        onClick={() => handleAddBlock("figure")}
      />
      <HeaderButton
        label="Tabla"
        description="Insertar tabla APA"
        icon={IconTable}
        onClick={() => handleAddBlock("table")}
      />
    </Group>
  );
};

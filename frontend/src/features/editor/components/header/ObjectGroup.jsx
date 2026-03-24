// src/features/editor/components/header/ObjectGroup.jsx
import React from "react";
import { Group } from "@mantine/core";
import { IconPhoto, IconTable, IconFilePlus } from "@tabler/icons-react";
import { useStore } from "@store";
import { HeaderButton } from "./HeaderButton";

export const ObjectGroup = () => {
  const {
    addBlock,
    addAndEditSource,
    setActiveTab,
    setInspectorOpen, // Esta es la función que ya tienes en el slice
    selectedSourceId,
  } = useStore();

  const handleAddBlock = (type) => {
    addBlock(type);
    setActiveTab("properties");
    setInspectorOpen(true); // <--- Abrimos el inspector
  };

  const handleAddReference = () => {
    addAndEditSource("articulo");
    setActiveTab("library");
    setInspectorOpen(true); // <--- Abrimos el inspector
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
      <HeaderButton
        label="Referencia"
        description="Nueva fuente bibliográfica"
        icon={IconFilePlus}
        onClick={handleAddReference}
        isActive={!!selectedSourceId}
      />
    </Group>
  );
};

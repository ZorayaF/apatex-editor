import React from "react";
import { Group } from "@mantine/core";
import { IconPhoto, IconTable, IconFilePlus } from "@tabler/icons-react";
import { useStore } from "@store";
import { HeaderButton } from "./HeaderButton";

export const ObjectGroup = () => {
  const { addAndEditSource, setActiveTab, selectedSourceId } = useStore();

  const handleAddReference = () => {
    addAndEditSource("articulo");
    setActiveTab("library"); // Movemos al usuario a la pestaña de fuentes
  };

  return (
    <Group gap={4}>
      <HeaderButton
        label="Imagen"
        description="Insertar figura o imagen"
        icon={IconPhoto}
        onClick={() => {
          /* addBlock('image'); setActiveTab('properties'); */
        }}
      />
      <HeaderButton
        label="Tabla"
        description="Insertar tabla APA"
        icon={IconTable}
        onClick={() => {
          /* addBlock('table'); setActiveTab('properties'); */
        }}
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

// src/features/editor/components/header/AcademicGroup.jsx
import React from "react";
import { Group } from "@mantine/core";
import { IconFilePlus, IconQuote } from "@tabler/icons-react";
import { useStore } from "@store";
import { HeaderButton } from "../HeaderButton";

export const AcademicGroup = () => {
  const { addAndEditSource, setActiveTab, setInspectorOpen, selectedSourceId } =
    useStore();

  // Función para crear una nueva fuente (abre formulario vacío)
  const handleAddReference = () => {
    addAndEditSource("articulo");
    setActiveTab("library");
    setInspectorOpen(true);
  };

  // Función para abrir la biblioteca y citar algo existente
  const handleOpenLibrary = () => {
    setActiveTab("library");
    setInspectorOpen(true);
  };

  return (
    <Group gap={4}>
      <HeaderButton
        label="Nueva Fuente"
        description="Crear referencia bibliográfica"
        icon={IconFilePlus}
        onClick={handleAddReference}
        isActive={!!selectedSourceId}
      />
      <HeaderButton
        label="Citar"
        description="Insertar cita (Autor, Año) en el texto"
        icon={IconQuote} // Icono de comillas para citas
        onClick={handleOpenLibrary}
      />
    </Group>
  );
};

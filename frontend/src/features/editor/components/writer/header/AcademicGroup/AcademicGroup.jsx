// src/features/editor/components/header/AcademicGroup.jsx
import React from "react";
import { Group } from "@mantine/core";
import { IconFilePlus, IconQuote } from "@tabler/icons-react";
import { useStore } from "@store";
import { HeaderButton } from "../HeaderButton";

export const AcademicGroup = () => {
  const {
    addAndEditSource,
    setActiveTab,
    setInspectorOpen,
    activeTab,
    selectedSourceId,
    setSelectedSourceId,
    setSelectedBlockId,
  } = useStore();

  // 1. Estados activos calculados
  // "Citar" está activo si estamos en la biblioteca viendo la lista
  const isCitarActive = activeTab === "library" && !selectedSourceId;

  // "Nueva Fuente" está activo si estamos editando o creando una fuente
  const isNuevaFuenteActive = activeTab === "library" && !!selectedSourceId;

  // 2. "Nueva Fuente": siempre crea/abre el formulario sin cerrar el panel
  const handleAddReference = () => {
    setSelectedBlockId(null); // Deselecciona tablas/figuras activas
    addAndEditSource("articulo");
    setActiveTab("library");
    setInspectorOpen(true);
  };

  // 3. "Citar": siempre lleva a la lista limpia de fuentes
  const handleOpenLibrary = () => {
    setSelectedBlockId(null); // Deselecciona tablas/figuras activas
    setSelectedSourceId(null); // Vuelve a la lista de fuentes
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
        isActive={isNuevaFuenteActive}
      />
      <HeaderButton
        label="Citar"
        description="Insertar cita (Autor, Año) en el texto"
        icon={IconQuote}
        onClick={handleOpenLibrary}
        isActive={isCitarActive}
      />
    </Group>
  );
};

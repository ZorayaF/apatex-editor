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
    isInspectorOpen, // o inspectorOpen según cómo lo tengas en el store
    activeTab,
    selectedSourceId,
    setSelectedSourceId,
  } = useStore();

  // 1. Estados activos calculados
  // "Citar" está activo si el panel está abierto, en la pestaña "library" y viendo la lista (no editando)
  const isCitarActive =
    isInspectorOpen && activeTab === "library" && !selectedSourceId;

  // "Nueva Fuente" está activo si el panel está abierto, en "library" y creando/editando una fuente
  const isNuevaFuenteActive =
    isInspectorOpen && activeTab === "library" && !!selectedSourceId;

  // 2. Manejo de "Nueva Fuente" con Toggle
  const handleAddReference = () => {
    if (isNuevaFuenteActive) {
      // Si ya está abierto el formulario, el clic lo cierra
      setInspectorOpen(false);
      setSelectedSourceId(null);
    } else {
      addAndEditSource("articulo");
      setActiveTab("library");
      setInspectorOpen(true);
    }
  };

  // 3. Manejo de "Citar" con Toggle y Reset de vista
  const handleOpenLibrary = () => {
    if (isCitarActive) {
      // Si ya está abierta la lista de fuentes, el clic lo cierra
      setInspectorOpen(false);
    } else {
      // Si estaba editando una fuente o en otra pestaña, lo lleva a la lista limpia
      setSelectedSourceId(null);
      setActiveTab("library");
      setInspectorOpen(true);
    }
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

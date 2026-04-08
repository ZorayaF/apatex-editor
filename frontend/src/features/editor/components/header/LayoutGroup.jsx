import React from "react";
import { Group, Divider } from "@mantine/core";
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
} from "@tabler/icons-react";
import { useStore } from "@store";
import { HeaderButton } from "./HeaderButton";

export const LayoutGroup = () => {
  const { isNavbarOpen, setNavbarOpen, isInspectorOpen, setInspectorOpen } =
    useStore();

  return (
    <Group gap={4}>
      {/* Botón para el Mapa del Documento (Izquierda) */}
      <HeaderButton
        label="Mapa"
        description={isNavbarOpen ? "Ocultar mapa" : "Mostrar mapa"}
        icon={
          isNavbarOpen
            ? IconLayoutSidebarLeftCollapse
            : IconLayoutSidebarLeftExpand
        }
        onClick={() => setNavbarOpen(!isNavbarOpen)}
        isActive={isNavbarOpen}
      />

      <Divider orientation="vertical" mx={4} />

      {/* Botón para el Inspector (Derecha) */}
      <HeaderButton
        label="Panel"
        description={
          isInspectorOpen ? "Ocultar propiedades" : "Mostrar propiedades"
        }
        icon={
          isInspectorOpen
            ? IconLayoutSidebarRightCollapse
            : IconLayoutSidebarRightExpand
        }
        onClick={() => setInspectorOpen(!isInspectorOpen)}
        isActive={isInspectorOpen}
      />
    </Group>
  );
};

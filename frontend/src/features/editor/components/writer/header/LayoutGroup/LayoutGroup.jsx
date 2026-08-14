// src/features/editor/components/writer/header/LayoutGroup/LayoutGroup.jsx
import React from "react";
import { Group, ActionIcon, Tooltip, Button } from "@mantine/core";
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import { useStore } from "@store";
import { HeaderButton } from "../HeaderButton";

// Botón para el Panel Izquierdo (Índice / Capítulos)
export const LeftPanelToggle = () => {
  const { isNavbarOpen, setNavbarOpen } = useStore();
  return (
    <HeaderButton
      label="Índice"
      description={
        isNavbarOpen
          ? "Ocultar índice del documento"
          : "Mostrar índice del documento"
      }
      icon={
        isNavbarOpen
          ? IconLayoutSidebarLeftCollapse
          : IconLayoutSidebarLeftExpand
      }
      onClick={() => setNavbarOpen(!isNavbarOpen)}
      isActive={isNavbarOpen}
    />
  );
};

// Botón para el Panel Derecho (Herramientas / Formato)
export const RightPanelToggle = () => {
  const { isInspectorOpen, setInspectorOpen } = useStore();
  return (
    <HeaderButton
      label="Herramientas"
      description={
        isInspectorOpen
          ? "Ocultar herramientas y referencias"
          : "Mostrar herramientas y referencias"
      }
      icon={
        isInspectorOpen
          ? IconLayoutSidebarRightCollapse
          : IconLayoutSidebarRightExpand
      }
      onClick={() => setInspectorOpen(!isInspectorOpen)}
      isActive={isInspectorOpen}
    />
  );
};

// Widget de Zoom central
export const ZoomControl = () => {
  const { zoom = 1.0, zoomIn, zoomOut, resetZoom } = useStore();
  const zoomPercentage = Math.round(zoom * 100);

  return (
    <Group gap={2} align="center">
      <Tooltip label="Alejar zoom" withArrow position="bottom">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={zoomOut}
          disabled={zoom <= 0.5}
        >
          <IconMinus size={14} />
        </ActionIcon>
      </Tooltip>

      <Tooltip label="Restablecer a 100%" withArrow position="bottom">
        <Button
          variant="subtle"
          color="gray"
          size="compact-xs"
          onClick={resetZoom}
          styles={{
            root: {
              minWidth: 44,
              padding: "0 2px",
              fontWeight: 600,
              fontSize: "11px",
            },
          }}
        >
          {zoomPercentage}%
        </Button>
      </Tooltip>

      <Tooltip label="Acercar zoom" withArrow position="bottom">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={zoomIn}
          disabled={zoom >= 2.0}
        >
          <IconPlus size={14} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

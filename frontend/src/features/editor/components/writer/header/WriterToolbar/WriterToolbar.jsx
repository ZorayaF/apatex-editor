// src/features/editor/components/writer/header/WriterToolbar/WriterToolbar.jsx
import React from "react";
import { Group, Divider } from "@mantine/core";
import { FormattingGroup } from "../FormattingGroup";
import { ObjectGroup } from "../ObjectGroup";
import { AcademicGroup } from "../AcademicGroup";
import {
  LeftPanelToggle,
  RightPanelToggle,
  ZoomControl,
} from "../LayoutGroup/LayoutGroup";

export const WriterToolbar = () => {
  return (
    <Group
      justify="space-between"
      px="md"
      wrap="nowrap"
      style={{ width: "100%", boxSizing: "border-box" }}
    >
      {/* 1. EXTREMO IZQUIERDO: Encima del panel de Índice */}
      <Group gap="xs" wrap="nowrap">
        <LeftPanelToggle />
      </Group>

      {/* 2. CENTRO: Herramientas de edición y Zoom */}
      <Group gap="xs" wrap="nowrap">
        <FormattingGroup />
        <Divider orientation="vertical" />
        <ObjectGroup />
        <Divider orientation="vertical" />
        <AcademicGroup />
        <Divider orientation="vertical" />
        <ZoomControl />
      </Group>

      {/* 3. EXTREMO DERECHO: Encima del panel de Herramientas */}
      <Group gap="xs" wrap="nowrap">
        <RightPanelToggle />
      </Group>
    </Group>
  );
};

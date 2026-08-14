// src/features/editor/components/writer/header/WriterToolbar/WriterToolbar.jsx
import React from "react";
import { Group, Divider } from "@mantine/core";
import { HistoryGroup } from "../HistoryGroup/HistoryGroup"; // <--- Importación directa
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
      {/* 1. EXTREMO IZQUIERDO: Índice */}
      <Group gap="xs" wrap="nowrap">
        <LeftPanelToggle />
      </Group>

      {/* 2. CENTRO: Historial, Formato, Objetos, Académico y Zoom */}
      <Group gap="xs" wrap="nowrap">
        <HistoryGroup />
        <Divider orientation="vertical" />
        <FormattingGroup />
        <Divider orientation="vertical" />
        <ObjectGroup />
        <Divider orientation="vertical" />
        <AcademicGroup />
        <Divider orientation="vertical" />
        <ZoomControl />
      </Group>

      {/* 3. EXTREMO DERECHO: Inspector */}
      <Group gap="xs" wrap="nowrap">
        <RightPanelToggle />
      </Group>
    </Group>
  );
};

// src/features/editor/components/writer/header/HistoryGroup/HistoryGroup.jsx
import React from "react";
import { Group } from "@mantine/core";
import { IconArrowBackUp, IconArrowForwardUp } from "@tabler/icons-react";
import { useStore } from "@store";
import { HeaderButton } from "../HeaderButton";

export const HistoryGroup = () => {
  const { undo, redo, canUndo, canRedo } = useStore();

  return (
    <Group gap={4} wrap="nowrap">
      <HeaderButton
        label="Deshacer"
        description="Deshacer (Ctrl + Z)"
        icon={IconArrowBackUp}
        onClick={undo}
        disabled={!canUndo}
      />
      <HeaderButton
        label="Rehacer"
        description="Rehacer (Ctrl + Y)"
        icon={IconArrowForwardUp}
        onClick={redo}
        disabled={!canRedo}
      />
    </Group>
  );
};

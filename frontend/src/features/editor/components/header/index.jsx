// features/editor/components/header/index.jsx
import React from "react";
import { Paper, Group, ScrollArea } from "@mantine/core";
import { TextGroup } from "./TextGroup";

export const Header = () => {
  return (
    <Paper
      h={70} // Ajustado para que sea más esbelto
      px="md"
      pos="sticky"
      top={0}
      style={{
        zIndex: 100,
        borderBottom: "1px solid var(--mantine-color-gray-3)",
        backgroundColor: "var(--mantine-color-white)",
      }}
      radius={0}
    >
      <ScrollArea h="100%" type="never">
        <Group h="100%" align="center">
          {/* Solo mostramos lo que funciona actualmente */}
          <TextGroup />
        </Group>
      </ScrollArea>
    </Paper>
  );
};

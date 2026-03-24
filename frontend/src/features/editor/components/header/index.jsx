import React from "react";
import { Paper, Group, Divider, Box } from "@mantine/core";
import { FormattingGroup } from "./FormattingGroup";
import { ObjectGroup } from "./ObjectGroup";

export const Header = () => {
  return (
    <Paper
      h={52} // Altura fija y esbelta
      px="md"
      pos="sticky"
      top={0}
      shadow="none"
      radius={0}
    >
      <Group h="100%" align="center" gap="lg">
        {/* Grupo A: Escritura y Formato */}
        <Box>
          <FormattingGroup />
        </Box>

        {/* El Divisor Vertical Limpio */}
        <Divider orientation="vertical" h={30} my="auto" color="gray.3" />

        {/* Grupo B: Inserción de Objetos */}
        <Box>
          <ObjectGroup />
        </Box>
      </Group>
    </Paper>
  );
};

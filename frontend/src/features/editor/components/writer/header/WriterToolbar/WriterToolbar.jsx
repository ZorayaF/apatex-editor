// src/features/editor/components/writer/header/WriterToolbar.jsx
import React from "react";
import { Group, Divider, Box } from "@mantine/core";
// Ajusta estas rutas según tus nuevos aliases
import { FormattingGroup } from "../FormattingGroup";
import { ObjectGroup } from "../ObjectGroup";
import { AcademicGroup } from "../AcademicGroup";

export const WriterToolbar = () => {
  return (
    <Group h="100%" align="center" gap="lg" justify="center" w="100%">
      <Box>
        <FormattingGroup />
      </Box>
      <Divider orientation="vertical" h={24} my="auto" color="gray.3" />
      <Box>
        <ObjectGroup />
      </Box>
      <Divider orientation="vertical" h={24} my="auto" color="gray.3" />
      <Box>
        <AcademicGroup />
      </Box>
    </Group>
  );
};

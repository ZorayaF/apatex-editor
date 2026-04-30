// src/features/editor/components/config/forms/GlossaryForm.jsx

import React, { useState } from "react";
// 1. Agregamos "Box" a la lista de importaciones
import {
  Stack,
  TextInput,
  Textarea,
  Button,
  ActionIcon,
  Group,
  Paper,
  Text,
  Divider,
  Box,
} from "@mantine/core";

import { IconPlus, IconTrash, IconSortAZ } from "@tabler/icons-react";
import { useStore } from "@store";

export const GlossaryForm = () => {
  const { projectMetadata, setProjectMetadata } = useStore();
  const terms = projectMetadata.preliminares.glosario?.terms || [];

  const [newTerm, setNewTerm] = useState({ term: "", definition: "" });

  const updateTerms = (newList) => {
    // Ordenar alfabéticamente antes de guardar
    const sorted = [...newList].sort((a, b) => a.term.localeCompare(b.term));
    setProjectMetadata("preliminares.glosario.terms", sorted);
  };

  const addTerm = () => {
    if (!newTerm.term || !newTerm.definition) return;

    // Aplicar reglas de mayúsculas/minúsculas
    const formattedTerm =
      newTerm.term.charAt(0).toUpperCase() + newTerm.term.slice(1);
    const formattedDef =
      newTerm.definition.charAt(0).toLowerCase() + newTerm.definition.slice(1);

    updateTerms([
      ...terms,
      { ...newTerm, term: formattedTerm, definition: formattedDef },
    ]);
    setNewTerm({ term: "", definition: "" });
  };

  const removeTerm = (index) => {
    updateTerms(terms.filter((_, i) => i !== index));
  };

  return (
    <Stack gap="xl">
      <Paper withBorder p="md" bg="gray.0" radius="md">
        <Text fw={700} size="sm" mb="md">
          Añadir Nuevo Término
        </Text>
        <Stack gap="sm">
          <TextInput
            placeholder="Término (ej: Algoritmo)"
            value={newTerm.term}
            onChange={(e) => setNewTerm({ ...newTerm, term: e.target.value })}
          />
          <Textarea
            placeholder="Definición..."
            autosize
            minRows={2}
            value={newTerm.definition}
            onChange={(e) =>
              setNewTerm({ ...newTerm, definition: e.target.value })
            }
          />
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={addTerm}
            fullWidth
            variant="light"
          >
            Añadir al Glosario
          </Button>
        </Stack>
      </Paper>

      <Divider
        label={`Términos en el glosario (${terms.length})`}
        labelPosition="center"
      />

      <Stack gap="sm">
        {terms.map((item, index) => (
          <Paper key={index} withBorder p="sm" shadow="xs">
            <Group align="flex-start" justify="space-between" wrap="nowrap">
              <Box style={{ flex: 1 }}>
                <Text fw={700} fs="italic" size="sm">
                  {item.term}:
                </Text>
                <Text size="sm" c="dimmed">
                  {item.definition}
                </Text>
              </Box>
              <ActionIcon
                color="red"
                variant="subtle"
                onClick={() => removeTerm(index)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
};

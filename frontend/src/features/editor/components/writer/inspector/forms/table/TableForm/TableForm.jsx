import React from "react";
import {
  Stack,
  TextInput,
  Textarea,
  Group,
  Button,
  Text,
  Divider,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconPlus,
  IconMinus,
  IconTableExport,
  IconLayoutRows,
  IconLayoutColumns,
  IconPlaylistX, // <--- ¡AQUÍ ESTÁ EL ÍCONO QUE FALTABA!
} from "@tabler/icons-react";
import { useStore } from "@store";
import { InspectorSection } from "@writer/inspector/InspectorSection";

export const TableForm = ({ blockData }) => {
  const { updateBlock, removeBlock } = useStore();

  const handleMetadataChange = (field, value) => {
    updateBlock(blockData.id, { [field]: value });
  };

  // --- LÓGICA DE ESTRUCTURA ---

  const addRow = () => {
    const newRow = new Array(blockData.data[0].length).fill("");
    updateBlock(blockData.id, {
      data: [...blockData.data, newRow],
    });
  };

  const removeRow = () => {
    if (blockData.data.length <= 1) return; // Mínimo una fila (cabecera)
    updateBlock(blockData.id, {
      data: blockData.data.slice(0, -1),
    });
  };

  const addColumn = () => {
    const newData = blockData.data.map((row) => [...row, ""]);
    updateBlock(blockData.id, { data: newData });
  };

  const removeColumn = () => {
    if (blockData.data[0].length <= 1) return;
    const newData = blockData.data.map((row) => row.slice(0, -1));
    updateBlock(blockData.id, { data: newData });
  };

  return (
    <Stack gap="lg">
      <InspectorSection title="Información APA">
        <TextInput
          label="Título de la Tabla"
          description="Se mostrará en cursiva debajo del número"
          placeholder="Ej: Distribución de la muestra por edades"
          value={blockData.title || ""}
          onChange={(e) => handleMetadataChange("title", e.target.value)}
          mb="sm"
        />
        <Textarea
          label="Nota o Fuente"
          description="Tamaño 10 al pie de la tabla"
          placeholder="Nota: Elaboración propia (2024)."
          value={blockData.note || ""}
          onChange={(e) => handleMetadataChange("note", e.target.value)}
          autosize
          minRows={2}
        />
      </InspectorSection>

      <Divider label="Gestión de Estructura" labelPosition="center" />

      <InspectorSection title="Filas y Columnas">
        <Stack gap="xs">
          <Group grow>
            <Stack gap={4}>
              <Text size="xs" fw={500} c="dimmed">
                Filas
              </Text>
              <Group gap={5}>
                <ActionIcon variant="light" onClick={removeRow} color="red">
                  <IconMinus size={16} />
                </ActionIcon>
                <Text size="sm" fw={700} w={20} ta="center">
                  {blockData.data.length}
                </Text>
                <ActionIcon variant="light" onClick={addRow} color="blue">
                  <IconPlus size={16} />
                </ActionIcon>
              </Group>
            </Stack>

            <Stack gap={4}>
              <Text size="xs" fw={500} c="dimmed">
                Columnas
              </Text>
              <Group gap={5}>
                <ActionIcon variant="light" onClick={removeColumn} color="red">
                  <IconMinus size={16} />
                </ActionIcon>
                <Text size="sm" fw={700} w={20} ta="center">
                  {blockData.data[0].length}
                </Text>
                <ActionIcon variant="light" onClick={addColumn} color="blue">
                  <IconPlus size={16} />
                </ActionIcon>
              </Group>
            </Stack>
          </Group>

          <Divider mt="md" mb="xs" />

          {/* EL BOTÓN DESTRUCTOR CORREGIDO */}
          <Button
            variant="light"
            color="red"
            fullWidth
            leftSection={<IconPlaylistX size={18} />}
            onClick={() => removeBlock(blockData.id)}
          >
            Eliminar Tabla del Documento
          </Button>
        </Stack>
      </InspectorSection>

      <Text size="xs" c="dimmed" fs="italic" ta="center">
        * Haz clic directamente en las celdas de la página para editar el
        contenido.
      </Text>
    </Stack>
  );
};

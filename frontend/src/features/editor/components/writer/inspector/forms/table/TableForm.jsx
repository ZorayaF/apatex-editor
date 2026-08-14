import React from "react";
import {
  TextInput,
  Textarea,
  Group,
  Text,
  ActionIcon,
  Paper,
  Stack,
  Box,
} from "@mantine/core";
import {
  IconPlus,
  IconMinus,
  IconTable,
  IconX,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useStore } from "@store";
import { notifications } from "@mantine/notifications";
import { InspectorContainer } from "../../components/InspectorContainer";
import { InspectorSection } from "../../components/InspectorSection";

export const TableForm = ({ blockData }) => {
  const { updateBlock, removeBlock, setSelectedBlockId } = useStore();

  const handleMetadataChange = (field, value) => {
    updateBlock(blockData.id, { [field]: value });
  };

  const addRow = () => {
    const colsCount = blockData.data[0]?.length || 1;
    updateBlock(blockData.id, {
      data: [...blockData.data, new Array(colsCount).fill("")],
    });
  };

  const removeRow = () => {
    if (blockData.data.length <= 1) return;
    updateBlock(blockData.id, { data: blockData.data.slice(0, -1) });
  };

  const addColumn = () => {
    updateBlock(blockData.id, {
      data: blockData.data.map((row) => [...row, ""]),
    });
  };

  const removeColumn = () => {
    if (blockData.data[0].length <= 1) return;
    updateBlock(blockData.id, {
      data: blockData.data.map((row) => row.slice(0, -1)),
    });
  };

  const handleClose = () => setSelectedBlockId(null);

  const handleDelete = () => {
    removeBlock(blockData.id);
    setSelectedBlockId(null);
    notifications.show({
      id: `table-del-${blockData.id}`,
      message: "Tabla eliminada",
      color: "red",
      autoClose: 1500,
      withCloseButton: false,
    });
  };

  return (
    <InspectorContainer
      activeSegment="active"
      onNavChange={(val) => val === "close" && handleClose()}
      navSegments={[
        {
          value: "close",
          label: (
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                justifyContent: "center",
              }}
            >
              <IconX size={14} />
              <span>Deseleccionar</span>
            </Box>
          ),
        },
        {
          value: "active",
          label: (
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                justifyContent: "center",
              }}
            >
              <IconTable size={14} />
              <span>Tabla Activa</span>
            </Box>
          ),
        },
      ]}
      onSave={handleClose}
      saveLabel="Listo"
      onDelete={handleDelete}
      deleteTooltip="Eliminar tabla permanentemente"
    >
      <Paper
        p="xs"
        radius="md"
        withBorder
        style={{
          backgroundColor: "var(--mantine-color-blue-0)",
          borderColor: "var(--mantine-color-blue-3)",
        }}
      >
        <Group gap="xs" align="flex-start" wrap="nowrap">
          <IconInfoCircle
            size={18}
            color="var(--mantine-color-blue-6)"
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <Text size="xs" fw={500} c="blue.9" style={{ lineHeight: 1.4 }}>
            Haz clic directamente en las celdas de la página para editar su
            contenido.
          </Text>
        </Group>
      </Paper>

      <InspectorSection title="Datos de la Tabla">
        <TextInput
          size="xs"
          label="Título de la Tabla"
          description="Cursiva en formato APA"
          placeholder="Ej: Distribución de la muestra por edades"
          value={blockData.title || ""}
          onChange={(e) => handleMetadataChange("title", e.target.value)}
        />
        <Textarea
          size="xs"
          label="Nota al pie / Fuente"
          description="Tamaño 10 pt al pie de la tabla"
          placeholder="Nota. Elaboración propia (2024)."
          value={blockData.note || ""}
          onChange={(e) => handleMetadataChange("note", e.target.value)}
          autosize
          minRows={2}
        />
      </InspectorSection>

      <InspectorSection title="Dimensiones">
        <Group grow align="center">
          <Paper withBorder p="xs" radius="md">
            <Stack gap={4} align="center">
              <Text size="xs" fw={600} c="dimmed">
                FILAS
              </Text>
              <Group gap={6} justify="center">
                <ActionIcon
                  variant="light"
                  color="gray"
                  size="sm"
                  onClick={removeRow}
                  disabled={blockData.data.length <= 1}
                >
                  <IconMinus size={14} />
                </ActionIcon>
                <Text size="sm" fw={700} w={24} ta="center">
                  {blockData.data.length}
                </Text>
                <ActionIcon
                  variant="light"
                  color="blue"
                  size="sm"
                  onClick={addRow}
                >
                  <IconPlus size={14} />
                </ActionIcon>
              </Group>
            </Stack>
          </Paper>

          <Paper withBorder p="xs" radius="md">
            <Stack gap={4} align="center">
              <Text size="xs" fw={600} c="dimmed">
                COLUMNAS
              </Text>
              <Group gap={6} justify="center">
                <ActionIcon
                  variant="light"
                  color="gray"
                  size="sm"
                  onClick={removeColumn}
                  disabled={blockData.data[0]?.length <= 1}
                >
                  <IconMinus size={14} />
                </ActionIcon>
                <Text size="sm" fw={700} w={24} ta="center">
                  {blockData.data[0]?.length || 1}
                </Text>
                <ActionIcon
                  variant="light"
                  color="blue"
                  size="sm"
                  onClick={addColumn}
                >
                  <IconPlus size={14} />
                </ActionIcon>
              </Group>
            </Stack>
          </Paper>
        </Group>
      </InspectorSection>
    </InspectorContainer>
  );
};

import React from "react";
import {
  TextInput,
  Textarea,
  Button,
  FileButton,
  Text,
  Divider,
  Slider,
  Group,
  Box,
  Paper,
  Badge,
} from "@mantine/core";
import {
  IconUpload,
  IconLink,
  IconTrash,
  IconPhoto,
  IconX,
  IconCheck,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons-react";
import { useStore } from "@store";
import { notifications } from "@mantine/notifications";
import { InspectorContainer } from "../../components/InspectorContainer";
import { InspectorSection } from "../../components/InspectorSection";

export const FigureForm = ({ blockData }) => {
  const { updateBlock, removeBlock, setSelectedBlockId } = useStore();

  const currentWidth = blockData.width || 100;

  const handleChange = (field, value) => {
    updateBlock(blockData.id, { [field]: value });
  };

  const handleUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      updateBlock(blockData.id, {
        url: e.target.result,
        isLocal: true,
      });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    updateBlock(blockData.id, { url: "", isLocal: false });
  };

  const handleClose = () => {
    setSelectedBlockId(null);
  };

  const handleDelete = () => {
    removeBlock(blockData.id);
    setSelectedBlockId(null);
    notifications.show({
      id: `table-deleted-${blockData.id}`,
      title: "Tabla eliminada",
      message: "La tabla ha sido removida del documento.",
      color: "red",
      autoClose: 2500,
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
              <IconPhoto size={14} />
              <span>Figura Activa</span>
            </Box>
          ),
        },
      ]}
      onSave={handleClose}
      saveLabel="Listo"
      saveIcon={<IconCheck size={16} />}
      onDelete={handleDelete}
      deleteTooltip="Eliminar figura permanentemente"
    >
      {/* 1. ORIGEN DE LA IMAGEN */}
      <InspectorSection title="Subir imagen">
        {!blockData.isLocal ? (
          <FileButton onChange={handleUpload} accept="image/*">
            {(props) => (
              <Button
                {...props}
                size="xs"
                variant="light"
                color="blue"
                fullWidth
                leftSection={<IconUpload size={15} />}
              >
                Desde mi equipo
              </Button>
            )}
          </FileButton>
        ) : (
          <Button
            size="xs"
            variant="outline"
            color="red"
            fullWidth
            leftSection={<IconTrash size={15} />}
            onClick={clearImage}
          >
            Quitar archivo local
          </Button>
        )}

        <TextInput
          size="xs"
          label="URL Externa"
          placeholder="https://ejemplo.com/imagen.jpg"
          leftSection={<IconLink size={14} />}
          value={
            blockData.isLocal ? "Archivo local cargado" : blockData.url || ""
          }
          disabled={blockData.isLocal}
          onChange={(e) => handleChange("url", e.target.value)}
        />
      </InspectorSection>
      {/* 3. METADATOS APA */}
      <InspectorSection title="Datos de la Figura">
        <TextInput
          size="xs"
          label="Título"
          placeholder="Ej: Diagrama de flujo del algoritmo"
          value={blockData.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <Textarea
          size="xs"
          label="Nota al pie / Fuente"
          placeholder="Nota. Adaptado de González (2023)."
          value={blockData.note || ""}
          onChange={(e) => handleChange("note", e.target.value)}
          autosize
          minRows={2}
        />
      </InspectorSection>

      {/* 2. CONTROL DE TAMAÑO MEJORADO */}
      <InspectorSection title="Tamaño">
        <Paper withBorder p="xs" radius="md">
          <Group justify="space-between" align="center" mb="xs">
            <Text size="xs" fw={500} c="dimmed">
              Ancho en documento
            </Text>
            <Badge variant="light" color="blue" size="sm">
              {currentWidth}%
            </Badge>
          </Group>

          {/* Slider de precisión */}
          <Group gap="xs" align="center" mb="sm">
            <IconZoomOut size={14} color="var(--mantine-color-gray-5)" />
            <Slider
              style={{ flex: 1 }}
              size="sm"
              value={currentWidth}
              onChange={(val) => handleChange("width", val)}
              min={25}
              max={100}
              step={5}
              label={(val) => `${val}%`}
            />
            <IconZoomIn size={14} color="var(--mantine-color-gray-5)" />
          </Group>

          {/* Botones de ajuste rápido */}
          <Button.Group>
            {[25, 50, 75, 100].map((preset) => (
              <Button
                key={preset}
                variant={currentWidth === preset ? "filled" : "default"}
                size="compact-xs"
                style={{ flex: 1 }}
                onClick={() => handleChange("width", preset)}
              >
                {preset}%
              </Button>
            ))}
          </Button.Group>
        </Paper>
      </InspectorSection>
    </InspectorContainer>
  );
};

import React from "react";
import {
  Stack,
  TextInput,
  Textarea,
  Button,
  FileButton,
  Text,
  Divider,
  Slider,
  Group,
  ActionIcon,
} from "@mantine/core";
import {
  IconUpload,
  IconLink,
  IconTrash,
  IconPlaylistX,
} from "@tabler/icons-react";
import { useStore } from "@store";
import { InspectorSection } from "@writer/inspector/InspectorSection";

export const FigureForm = ({ blockData }) => {
  const { updateBlock, removeBlock } = useStore();

  const handleChange = (field, value) => {
    updateBlock(blockData.id, { [field]: value });
  };

  const handleUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      // Guardamos la imagen y marcamos como local
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

  return (
    <Stack gap="lg">
      <InspectorSection title="Origen de la Figura">
        <Stack gap="xs">
          {!blockData.isLocal ? (
            <FileButton onChange={handleUpload} accept="image/*">
              {(props) => (
                <Button
                  {...props}
                  variant="light"
                  leftSection={<IconUpload size={16} />}
                >
                  Subir desde mi equipo
                </Button>
              )}
            </FileButton>
          ) : (
            <Group grow>
              <Button
                variant="outline"
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={clearImage}
              >
                Quitar archivo local
              </Button>
            </Group>
          )}

          <Divider label="o" labelPosition="center" />

          <TextInput
            label="URL Externa"
            placeholder="https://ejemplo.com/imagen.jpg"
            leftSection={<IconLink size={16} />}
            value={
              blockData.isLocal ? "Archivo local cargado" : blockData.url || ""
            }
            disabled={blockData.isLocal} // <--- Deshabilitado si es local
            onChange={(e) => handleChange("url", e.target.value)}
          />
        </Stack>
      </InspectorSection>

      <InspectorSection title="Tamaño de la Figura">
        <Text size="xs" fw={500} mb={5} c="dimmed">
          Ancho de la imagen (%)
        </Text>
        <Slider
          value={blockData.width || 100}
          onChange={(val) => handleChange("width", val)}
          min={20}
          max={100}
          label={(val) => `${val}%`}
          marks={[
            { value: 50, label: "50%" },
            { value: 100, label: "100%" },
          ]}
          mb="xl"
        />
      </InspectorSection>

      <InspectorSection title="Información APA">
        <TextInput
          label="Título de la Figura"
          value={blockData.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          mb="sm"
        />
        <Textarea
          label="Nota"
          value={blockData.note || ""}
          onChange={(e) => handleChange("note", e.target.value)}
          autosize
          minRows={2}
        />
      </InspectorSection>
      <Divider />
      <Button
        variant="light"
        color="red"
        fullWidth
        leftSection={<IconPlaylistX size={18} />}
        onClick={() => removeBlock(blockData.id)} // Dispara la eliminación en el JSON
      >
        Eliminar Figura del Documento
      </Button>
    </Stack>
  );
};

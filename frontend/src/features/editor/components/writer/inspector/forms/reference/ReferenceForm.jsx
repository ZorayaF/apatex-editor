import React from "react";
import {
  Select,
  Divider,
  Stack,
  Alert,
  Group,
  ActionIcon,
  Text,
  Button,
} from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { useStore } from "@store";
import { InspectorSection } from "@writer/inspector/InspectorSection";
import { REFERENCE_SCHEMAS } from "@logic/references/referenceSchemas";
import { DynamicReferenceForm } from "./DynamicReferenceForm";

export const ReferenceForm = () => {
  // 1. Extraemos con cuidado del store
  const {
    selectedSourceId,
    sources,
    updateSource,
    clearSourceSelection,
    removeSource,
  } = useStore();

  // 2. Buscamos la fuente
  const sourceData = sources?.find((s) => s.id === selectedSourceId);

  // 3. Si no hay datos, evitamos que el componente explote
  if (!sourceData) return null;

  const currentSchema = REFERENCE_SCHEMAS[sourceData.type];

  const handleChange = (field, value) => {
    // Aquí es donde daba el error si updateSource no existía
    if (typeof updateSource === "function") {
      updateSource(selectedSourceId, { [field]: value });
    } else {
      console.error("Error: updateSource no está definida en el Store");
    }
  };

  const handleFinish = () => {
    const isEmpty = !sourceData.author?.trim() && !sourceData.title?.trim();
    if (isEmpty && typeof removeSource === "function") {
      removeSource(selectedSourceId);
    }
    clearSourceSelection();
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <ActionIcon variant="subtle" color="gray" onClick={handleFinish}>
            <IconArrowLeft size={18} />
          </ActionIcon>
          <Text fw={700} size="sm">
            Editar Fuente
          </Text>
        </Group>
        <Button
          variant="light"
          color="green"
          size="compact-xs"
          leftSection={<IconCheck size={14} />}
          onClick={handleFinish}
        >
          Finalizar
        </Button>
      </Group>

      <Divider />

      <InspectorSection title="Tipo de Fuente">
        <Select
          label="Categoría APA"
          data={Object.keys(REFERENCE_SCHEMAS).map((key) => ({
            value: key,
            label: REFERENCE_SCHEMAS[key].label,
          }))}
          value={sourceData.type}
          onChange={(val) => handleChange("type", val)}
          searchable
        />
      </InspectorSection>

      <Divider label="Datos Requeridos" labelPosition="center" />

      <DynamicReferenceForm
        schema={currentSchema}
        data={sourceData}
        onChange={handleChange}
      />

      <Alert
        color="orange"
        icon={<IconAlertCircle size={18} />}
        mt="xl"
        variant="light"
      >
        Los cambios se guardan automáticamente.
      </Alert>
    </Stack>
  );
};

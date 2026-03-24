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
import { InspectorSection } from "../../InspectorSection";
import { REFERENCE_SCHEMAS } from "../../../../logic/references/referenceSchemas";
import { DynamicReferenceForm } from "./DynamicReferenceForm";

export const ReferenceForm = () => {
  // Sacamos 'clearSourceSelection' que creamos en el uiSlice
  const { selectedSourceId, sources, updateSource, clearSourceSelection } =
    useStore();
  const sourceData = sources.find((s) => s.id === selectedSourceId);

  if (!sourceData) return null;

  const currentSchema = REFERENCE_SCHEMAS[sourceData.type];

  const handleChange = (field, value) => {
    updateSource(selectedSourceId, { [field]: value });
  };

  return (
    <Stack gap="lg">
      {/* --- CABECERA DE EDICIÓN --- */}
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={clearSourceSelection} // Volver a la lista
            title="Volver a la biblioteca"
          >
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
          onClick={clearSourceSelection} // Finalizar edición
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
        Los cambios se guardan automáticamente mientras escribes.
      </Alert>
    </Stack>
  );
};

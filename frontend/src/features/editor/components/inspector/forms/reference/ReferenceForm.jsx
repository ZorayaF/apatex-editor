import React from "react";
import { Select, Divider, Stack, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useStore } from "@store";
import { InspectorSection } from "../../InspectorSection";
import { REFERENCE_SCHEMAS } from "../../../../logic/references/referenceSchemas";
import { DynamicReferenceForm } from "./DynamicReferenceForm";

export const ReferenceForm = () => {
  const { selectedSourceId, sources, updateSource } = useStore();
  const sourceData = sources.find((s) => s.id === selectedSourceId);

  if (!sourceData) return null;

  // Obtenemos la "receta" según el tipo seleccionado
  const currentSchema = REFERENCE_SCHEMAS[sourceData.type];

  const handleChange = (field, value) => {
    updateSource(selectedSourceId, { [field]: value });
  };

  return (
    <Stack gap="lg">
      <InspectorSection title="Fuente de Información">
        <Select
          label="Tipo de Referencia"
          data={Object.keys(REFERENCE_SCHEMAS).map((key) => ({
            value: key,
            label: REFERENCE_SCHEMAS[key].label,
          }))}
          value={sourceData.type}
          onChange={(val) => handleChange("type", val)}
          searchable // ¡Ahora que son 15, que el usuario pueda buscar!
        />
      </InspectorSection>

      <Divider label="Datos de la Fuente" labelPosition="center" />

      {/* ¡AQUÍ ESTÁ LA MAGIA! El motor dinámico hace todo el trabajo */}
      <DynamicReferenceForm
        schema={currentSchema}
        data={sourceData}
        onChange={handleChange}
      />

      <Alert color="orange" icon={<IconAlertCircle size={18} />} mt="xl">
        Asegúrate de completar los campos para una citación APA correcta.
      </Alert>
    </Stack>
  );
};

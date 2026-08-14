import React, { useState } from "react";
import { Select, Button, Box } from "@mantine/core";
import {
  IconSparkles,
  IconBooks,
  IconEdit,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { useStore } from "@store";
import { notifications } from "@mantine/notifications";
import { InspectorContainer } from "../../components/InspectorContainer";
import { InspectorSection } from "../../components/InspectorSection";
import { REFERENCE_SCHEMAS } from "@logic/references/referenceSchemas";
import { parseReference } from "@logic/engine/referenceParser";
import { DynamicReferenceForm } from "./DynamicReferenceForm";
import { SmartImportModal } from "./SmartImportModal";

export const ReferenceForm = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const {
    selectedSourceId,
    sources,
    updateSource,
    clearSourceSelection,
    removeSource,
  } = useStore();

  const sourceData = sources?.find((s) => s.id === selectedSourceId);
  if (!sourceData) return null;

  const currentSchema = REFERENCE_SCHEMAS[sourceData.type];

  const handleChange = (field, value) => {
    if (typeof updateSource === "function") {
      updateSource(selectedSourceId, { [field]: value });
    }
  };

  const handleSmartImport = async (text) => {
    const result = parseReference(text);
    if (result.author) handleChange("author", result.author);
    if (result.year && result.year !== "s.f.")
      handleChange("year", parseInt(result.year));
    if (result.title) handleChange("title", result.title);

    const newMetadata = { ...(sourceData.metadata || {}) };
    ["url", "journal", "volume", "number", "pages", "publisher", "doi"].forEach(
      (f) => {
        if (result[f]) newMetadata[f] = result[f];
      },
    );
    handleChange("metadata", newMetadata);
  };

  const handleFinish = () => {
    const isEmpty = !sourceData.author?.trim() && !sourceData.title?.trim();
    if (isEmpty && typeof removeSource === "function") {
      removeSource(selectedSourceId);
    }
    clearSourceSelection();
  };

  return (
    <>
      <InspectorContainer
        activeSegment="editing"
        onNavChange={(val) => val === "library" && handleFinish()}
        navSegments={[
          {
            value: "library",
            label: (
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  justifyContent: "center",
                }}
              >
                <IconBooks size={14} />
                <span>Fuentes</span>
              </Box>
            ),
          },
          {
            value: "editing",
            label: (
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  justifyContent: "center",
                }}
              >
                <IconEdit size={14} />
                <span>Editando</span>
              </Box>
            ),
          },
        ]}
        onSave={handleFinish}
        saveLabel="Guardar y Cerrar"
        saveIcon={<IconDeviceFloppy size={16} />}
      >
        <Button
          variant="light"
          color="violet"
          size="xs"
          leftSection={<IconSparkles size={16} />}
          fullWidth
          onClick={() => setModalOpened(true)}
        >
          Autocompletar con texto pegado (Beta)
        </Button>

        <InspectorSection title="Tipo de Fuente">
          <Select
            size="xs"
            data={Object.keys(REFERENCE_SCHEMAS).map((key) => ({
              value: key,
              label: REFERENCE_SCHEMAS[key].label,
            }))}
            value={sourceData.type}
            onChange={(val) => handleChange("type", val)}
            searchable
            allowDeselect={false}
            comboboxProps={{ withinPortal: true }}
          />
        </InspectorSection>

        <InspectorSection title="Datos Requeridos">
          <DynamicReferenceForm
            schema={currentSchema}
            data={sourceData}
            onChange={handleChange}
          />
        </InspectorSection>
      </InspectorContainer>

      <SmartImportModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onApplyData={handleSmartImport}
      />
    </>
  );
};

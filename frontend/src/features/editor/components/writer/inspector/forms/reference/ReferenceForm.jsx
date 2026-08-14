import React, { useState } from "react";
import {
  Select,
  Divider,
  Stack,
  Group,
  ActionIcon,
  Text,
  Button,
  Box,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCheck,
  IconDeviceFloppy,
  IconSparkles,
} from "@tabler/icons-react";
import { useStore } from "@store";
import { notifications } from "@mantine/notifications";
import { InspectorSection } from "@writer/inspector/InspectorSection";
import { REFERENCE_SCHEMAS } from "@logic/references/referenceSchemas";
import { parseReference } from "@logic/engine/referenceParser";
import { DynamicReferenceForm } from "./DynamicReferenceForm";
import { SmartImportModal } from "./SmartImportModal";

import classes from "./ReferenceForm.module.css";

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
    const metadataFields = [
      "url",
      "journal",
      "volume",
      "number",
      "pages",
      "publisher",
      "doi",
    ];

    metadataFields.forEach((field) => {
      if (result[field]) {
        newMetadata[field] = result[field];
      }
    });

    handleChange("metadata", newMetadata);
  };

  const handleFinish = () => {
    const isEmpty = !sourceData.author?.trim() && !sourceData.title?.trim();
    if (isEmpty && typeof removeSource === "function") {
      removeSource(selectedSourceId);
    } else {
      notifications.show({
        id: `source-saved-${selectedSourceId}`,
        title: "Fuente guardada",
        message: "Los datos bibliográficos se sincronizaron con éxito.",
        color: "teal",
        icon: <IconCheck size={16} />,
        autoClose: 2500,
      });
    }
    clearSourceSelection();
  };

  return (
    <Box className={classes.container}>
      {/* 1. CABECERA FIJA */}
      <Box className={classes.header}>
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Tooltip label="Volver a la lista" position="bottom" withArrow>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="md"
                onClick={handleFinish}
              >
                <IconArrowLeft size={18} />
              </ActionIcon>
            </Tooltip>
            <div>
              <Text fw={700} size="sm">
                Editar Referencia
              </Text>
              <Text size="xs" c="dimmed">
                {currentSchema?.label || "Fuente bibliográfica"}
              </Text>
            </div>
          </Group>
        </Group>
        <Divider mt="xs" />
      </Box>

      {/* 2. FORMULARIO CON SCROLL */}
      <ScrollArea.Autosize
        className={classes.scrollBody}
        scrollbarSize={6}
        offsetScrollbars
      >
        <Stack gap="lg" className={classes.formContent}>
          {/* Botón de acceso a la función experimental */}
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

          {/* SECCIÓN 1: Tipo de Fuente */}
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
            />
          </InspectorSection>

          {/* SECCIÓN 2: Datos Requeridos (Mismo estilo que Sección 1) */}
          <InspectorSection title="Datos Requeridos">
            <DynamicReferenceForm
              schema={currentSchema}
              data={sourceData}
              onChange={handleChange}
            />
          </InspectorSection>
        </Stack>
      </ScrollArea.Autosize>

      {/* 3. PIE FIJO */}
      <Box className={classes.footer}>
        <Stack gap={6}>
          <Group justify="center" gap={4} className={classes.syncFeedback}>
            <IconCheck size={13} color="var(--mantine-color-teal-6)" />
            <Text size="xs" c="dimmed">
              Cambios sincronizados automáticamente
            </Text>
          </Group>

          <Button
            fullWidth
            color="blue"
            size="sm"
            leftSection={<IconDeviceFloppy size={16} />}
            onClick={handleFinish}
          >
            Guardar y Cerrar
          </Button>
        </Stack>
      </Box>

      {/* Modal NLP */}
      <SmartImportModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onApplyData={handleSmartImport}
      />
    </Box>
  );
};

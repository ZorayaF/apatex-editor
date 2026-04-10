import React, { useState } from "react";
import {
  TextInput,
  NumberInput,
  Stack,
  Textarea,
  Button,
  ActionIcon,
  Group,
  Text,
  Divider,
  Tooltip,
} from "@mantine/core";
import { IconSparkles, IconX } from "@tabler/icons-react";
import { REFERENCE_FIELDS } from "@editor/logic/references/fieldDefinitions";
import { parseReference } from "@editor/logic/engine/referenceParser"; // Tu función lógica
import { InspectorField } from "@inspector/InspectorField";

export const DynamicReferenceForm = ({ schema, data, onChange }) => {
  const [smartText, setSmartText] = useState("");
  const BASE_FIELDS = ["author", "year", "title"];

  // --- LÓGICA DE AUTO-COMPLETADO ---
  const handleSmartImport = () => {
    if (!smartText.trim()) return;

    const result = parseReference(smartText);

    // 1. Campos Base
    if (result.author) onChange("author", result.author);
    if (result.year && result.year !== "s.f.")
      onChange("year", parseInt(result.year));
    if (result.title) onChange("title", result.title);

    // 2. Mapeo Inteligente de Metadatos
    const newMetadata = { ...data.metadata };

    // Lista de campos que queremos mapear si el parser los encuentra
    const metadataFields = [
      "url",
      "journal",
      "volume",
      "number",
      "pages",
      "publisher",
    ];

    metadataFields.forEach((field) => {
      if (result[field]) {
        newMetadata[field] = result[field];
      }
    });

    onChange("metadata", newMetadata);
    setSmartText("");

    // Notificación opcional de éxito
    notifications.show({
      title: "¡Magia de VARPA!",
      message:
        "Hemos extraído autores, revista, volumen y páginas automáticamente.",
      color: "teal",
      icon: <IconSparkles size={16} />,
    });
  };

  return (
    <Stack gap="md">
      {/* --- SECCIÓN SMART INPUT (EL GANCHO DE TU TESIS) --- */}
      <Stack gap={5}>
        <Text size="xs" fw={700} c="blue.7">
          VARPA SMART IMPORT (NLP)
        </Text>
        <Textarea
          placeholder="Pega aquí la referencia de un repositorio o una nota rápida (ej: García Márquez 1967 Cien años...)"
          minRows={2}
          value={smartText}
          onChange={(e) => setSmartText(e.currentTarget.value)}
          rightSection={
            smartText && (
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setSmartText("")}
              >
                <IconX size={14} />
              </ActionIcon>
            )
          }
        />
        <Button
          fullWidth
          size="xs"
          variant="light"
          leftSection={<IconSparkles size={14} />}
          onClick={handleSmartImport}
          disabled={!smartText.trim()}
        >
          Auto-completar campos
        </Button>
      </Stack>

      <Divider label="O editar manualmente" labelPosition="center" />

      {/* --- FORMULARIO DINÁMICO ORIGINAL --- */}
      {schema.fields.map((fieldName) => {
        const config = REFERENCE_FIELDS[fieldName];
        if (!config) return null;

        const isBase = BASE_FIELDS.includes(fieldName);
        const value = isBase ? data[fieldName] : data.metadata?.[fieldName];

        const handleChange = (val) => {
          if (isBase) {
            onChange(fieldName, val);
          } else {
            onChange("metadata", {
              ...data.metadata,
              [fieldName]: val,
            });
          }
        };

        return (
          <InspectorField
            key={fieldName}
            label={config.label}
            description={config.description}
          >
            {config.type === "number" ? (
              <NumberInput
                placeholder={config.placeholder}
                value={value || ""}
                onChange={handleChange}
                hideControls
              />
            ) : (
              <TextInput
                placeholder={config.placeholder}
                value={value || ""}
                onChange={(e) => handleChange(e.currentTarget.value)}
              />
            )}
          </InspectorField>
        );
      })}
    </Stack>
  );
};

// src/features/editor/components/writer/inspector/forms/reference/SmartImportModal.jsx
import React, { useState } from "react";
import {
  Modal,
  Button,
  Textarea,
  Stack,
  Text,
  Badge,
  Group,
  Alert,
} from "@mantine/core";
import { IconSparkles, IconInfoCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

export const SmartImportModal = ({ opened, onClose, onApplyData }) => {
  const [rawText, setRawText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleProcess = async () => {
    if (!rawText.trim()) return;

    setIsLoading(true);
    try {
      await onApplyData(rawText);

      notifications.show({
        id: "smart-import-success",
        message: "Referencia extraída y completada",
        color: "teal",
        autoClose: 2000,
        withCloseButton: false,
      });

      setRawText("");
      onClose();
    } catch {
      notifications.show({
        id: "smart-import-error",
        message: "Formato no reconocido. Ingresa los datos manualmente.",
        color: "orange",
        autoClose: 3500,
        withCloseButton: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconSparkles size={18} color="var(--mantine-color-blue-6)" />
          <Text fw={600} size="sm">
            Importación Rápida
          </Text>
          <Badge size="xs" color="violet" variant="light">
            BETA
          </Badge>
        </Group>
      }
      centered
      radius="md"
      padding="md"
    >
      <Stack gap="sm">
        <Text size="xs" c="dimmed">
          Pega una referencia copiada de Google Scholar, Scopus o similar para
          extraer sus campos automáticamente.
        </Text>

        <Textarea
          placeholder="Ej: Pérez, M. (2020). Teoría económica y desarrollo sostenible. Editorial Académica."
          minRows={3}
          autosize
          value={rawText}
          onChange={(e) => setRawText(e.currentTarget.value)}
          autoFocus
        />

        <Alert
          variant="light"
          color="blue"
          icon={<IconInfoCircle size={16} />}
          py={6}
          styles={{ message: { fontSize: "11px" } }}
        >
          Función experimental: revisa los campos en el formulario tras
          autocompletar.
        </Alert>

        <Group justify="flex-end" gap="xs" mt="xs">
          <Button variant="subtle" color="gray" size="xs" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            size="xs"
            leftSection={<IconSparkles size={14} />}
            onClick={handleProcess}
            loading={isLoading}
            disabled={!rawText.trim()}
          >
            Extraer y Autocompletar
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

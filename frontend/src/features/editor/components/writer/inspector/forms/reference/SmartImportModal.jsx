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
import { IconSparkles, IconInfoCircle, IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import classes from "./SmartImportModal.module.css";

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
        title: "Datos autocompletados",
        message:
          "Por favor revisa los campos en el formulario para asegurar su precisión.",
        color: "teal",
        icon: <IconCheck size={16} />,
        autoClose: 3500,
      });

      setRawText("");
      onClose();
    } catch {
      notifications.show({
        id: "smart-import-error",
        title: "No se pudo procesar el texto",
        message:
          "Intenta escribir los campos manualmente o verifica el formato del texto.",
        color: "orange",
        autoClose: 4000,
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
          Útil si ya tienes la referencia generada por repositorios (ej: Google
          Scholar, Scopus) o una nota rápida de autor, año y título.
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
          classNames={{ message: classes.alertMessage }}
        >
          Esta función es experimental. Analizaremos el texto para rellenar las
          casillas automáticamente.
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

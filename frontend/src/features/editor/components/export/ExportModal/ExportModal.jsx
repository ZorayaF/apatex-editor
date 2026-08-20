import React from "react";
import {
  Modal,
  Stack,
  Text,
  Radio,
  Paper,
  Group,
  TextInput,
  Divider,
  Button,
  Box,
} from "@mantine/core";
import {
  IconFileTypePdf,
  IconFiles,
  IconListNumbers,
  IconCheck,
  IconEye,
} from "@tabler/icons-react";
import classes from "./ExportModal.module.css";

export const ExportModal = ({
  opened,
  onClose,
  exportScope,
  onChangeExportScope,
  pageRange,
  onChangePageRange,
  onConfirmExport,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconFileTypePdf size={22} color="var(--mantine-color-blue-6)" />
          <Text fw={700} size="md">
            Opciones de Exportación a PDF
          </Text>
        </Group>
      }
      centered
      size="md"
      radius="lg"
      padding="lg"
    >
      <Stack gap="lg">
        <Text size="xs" c="dimmed">
          Elige el alcance de las páginas que se compilarán en el archivo PDF
          final:
        </Text>

        <Radio.Group value={exportScope} onChange={onChangeExportScope}>
          <Stack gap="sm">
            {/* Opción 1: Vista Actual */}
            <Paper
              p="sm"
              radius="md"
              className={`${classes.card} ${
                exportScope === "current" ? classes.cardSelected : ""
              }`}
              onClick={() => onChangeExportScope("current")}
            >
              <Group gap="sm" align="flex-start" wrap="nowrap">
                <Box className={classes.radioWrapper} mt={2}>
                  <Radio
                    value="current"
                    checked={exportScope === "current"}
                    onChange={() => {}}
                  />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Group gap={6} align="center">
                    <IconEye size={16} color="var(--mantine-color-blue-6)" />
                    <Text size="sm" fw={600}>
                      Lo que está seleccionado en el panel
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed" mt={2}>
                    Descarga exactamente las secciones activadas en el panel
                    lateral.
                  </Text>
                </Box>
              </Group>
            </Paper>

            {/* Opción 2: Documento Completo */}
            <Paper
              p="sm"
              radius="md"
              className={`${classes.card} ${
                exportScope === "all" ? classes.cardSelected : ""
              }`}
              onClick={() => onChangeExportScope("all")}
            >
              <Group gap="sm" align="flex-start" wrap="nowrap">
                <Box className={classes.radioWrapper} mt={2}>
                  <Radio
                    value="all"
                    checked={exportScope === "all"}
                    onChange={() => {}}
                  />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Group gap={6} align="center">
                    <IconFiles size={16} color="var(--mantine-color-blue-6)" />
                    <Text size="sm" fw={600}>
                      Todo el documento completo
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed" mt={2}>
                    Compila todas las páginas existentes (preliminares,
                    redacción, referencias y anexos).
                  </Text>
                </Box>
              </Group>
            </Paper>

            {/* Opción 3: Rango Numérico */}
            <Paper
              p="sm"
              radius="md"
              className={`${classes.card} ${
                exportScope === "page_range" ? classes.cardSelected : ""
              }`}
              onClick={() => onChangeExportScope("page_range")}
            >
              <Group gap="sm" align="flex-start" wrap="nowrap">
                <Box className={classes.radioWrapper} mt={2}>
                  <Radio
                    value="page_range"
                    checked={exportScope === "page_range"}
                    onChange={() => {}}
                  />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Group gap={6} align="center">
                    <IconListNumbers
                      size={16}
                      color="var(--mantine-color-blue-6)"
                    />
                    <Text size="sm" fw={600}>
                      Rango específico de páginas
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed" mt={2}>
                    Exporta páginas puntuales según su orden numérico de
                    impresión.
                  </Text>

                  {exportScope === "page_range" && (
                    <Box
                      mt="xs"
                      onClick={(e) => e.stopPropagation()} // Evita reactivar la tarjeta al tipear
                    >
                      <TextInput
                        size="xs"
                        placeholder="Ej: 1, 2, 5-8, 12"
                        value={pageRange}
                        onChange={(e) => onChangePageRange(e.target.value)}
                        autoFocus
                      />
                      <Text size="10px" c="dimmed" mt={4}>
                        Usa comas para páginas individuales y guiones para
                        rangos continuos.
                      </Text>
                    </Box>
                  )}
                </Box>
              </Group>
            </Paper>
          </Stack>
        </Radio.Group>

        <Divider />

        <Group justify="flex-end" gap="sm">
          <Button variant="default" size="sm" radius="md" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            color="blue"
            size="sm"
            radius="md"
            leftSection={<IconCheck size={16} />}
            onClick={onConfirmExport}
            disabled={exportScope === "page_range" && !pageRange.trim()}
          >
            Guardar PDF
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

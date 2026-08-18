import React from "react";
import {
  Paper,
  ScrollArea,
  Stack,
  Box,
  Group,
  Text,
  NumberInput,
  Button,
  Divider,
  Checkbox,
} from "@mantine/core";
import {
  IconCompass,
  IconAdjustments,
  IconArrowRight,
} from "@tabler/icons-react";
import classes from "./ExportSidebar.module.css";

export const ExportSidebar = ({
  targetPage,
  onChangeTargetPage,
  onScrollToPage,
  sections,
  onToggleSection,
  onSetPreset,
}) => {
  return (
    <Paper className={`no-print ${classes.sidebar}`} w={280} bg="white">
      <ScrollArea style={{ flex: 1 }} p="md">
        <Stack gap="lg">
          {/* 1. Salto a Página */}
          <Box>
            <Group gap={6} mb="xs">
              <IconCompass size={16} color="var(--mantine-color-blue-6)" />
              <Text
                size="xs"
                fw={700}
                tt="uppercase"
                c="dimmed"
                className={classes.sectionHeader}
              >
                Página
              </Text>
            </Group>

            <Group gap="xs">
              <NumberInput
                size="xs"
                min={1}
                value={targetPage}
                onChange={(val) => onChangeTargetPage(val || 1)}
                style={{ flex: 1 }}
                placeholder="N.º"
              />
              <Button
                size="xs"
                variant="light"
                color="blue"
                rightSection={<IconArrowRight size={14} />}
                onClick={() => onScrollToPage(targetPage)}
              >
                Ir
              </Button>
            </Group>
          </Box>

          <Divider />

          {/* 2. Filtros de Sección */}
          <Box>
            <Group justify="space-between" align="center" mb="xs">
              <Group gap={6}>
                <IconAdjustments
                  size={16}
                  color="var(--mantine-color-blue-6)"
                />
                <Text
                  size="xs"
                  fw={700}
                  tt="uppercase"
                  c="dimmed"
                  className={classes.sectionHeader}
                >
                  Secciones Visibles
                </Text>
              </Group>
            </Group>

            {/* Presets Rápidos */}
            <Group gap={4} mb="sm">
              <Button
                size="compact-xs"
                variant="subtle"
                color="blue"
                onClick={() => onSetPreset("all")}
              >
                Todas
              </Button>
              <Button
                size="compact-xs"
                variant="subtle"
                color="gray"
                onClick={() => onSetPreset("body_only")}
              >
                Solo Redacción
              </Button>
              <Button
                size="compact-xs"
                variant="subtle"
                color="gray"
                onClick={() => onSetPreset("prelims_only")}
              >
                Solo Prelims
              </Button>
            </Group>

            {/* Checkboxes de Secciones */}
            <Stack gap={8}>
              <Text size="11px" fw={600} c="dimmed" mt={4}>
                Páginas Preliminares
              </Text>
              <Checkbox
                size="xs"
                label="Portada"
                checked={sections.titlePage}
                onChange={() => onToggleSection("titlePage")}
              />
              <Checkbox
                size="xs"
                label="Contraportada"
                checked={sections.contraportada}
                onChange={() => onToggleSection("contraportada")}
              />
              <Checkbox
                size="xs"
                label="Aceptación"
                checked={sections.aceptacion}
                onChange={() => onToggleSection("aceptacion")}
              />
              <Checkbox
                size="xs"
                label="Reglamento"
                checked={sections.reglamento}
                onChange={() => onToggleSection("reglamento")}
              />
              <Checkbox
                size="xs"
                label="Dedicatoria"
                checked={sections.dedicatoria}
                onChange={() => onToggleSection("dedicatoria")}
              />
              <Checkbox
                size="xs"
                label="Agradecimientos"
                checked={sections.agradecimientos}
                onChange={() => onToggleSection("agradecimientos")}
              />
              <Checkbox
                size="xs"
                label="Tabla de Contenido"
                checked={sections.toc}
                onChange={() => onToggleSection("toc")}
              />
              <Checkbox
                size="xs"
                label="Glosario"
                checked={sections.glosario}
                onChange={() => onToggleSection("glosario")}
              />
              <Checkbox
                size="xs"
                label="Resumen"
                checked={sections.resumen}
                onChange={() => onToggleSection("resumen")}
              />
              <Checkbox
                size="xs"
                label="Abstract"
                checked={sections.abstract}
                onChange={() => onToggleSection("abstract")}
              />
              <Checkbox
                size="xs"
                label="Introducción"
                checked={sections.introduccion}
                onChange={() => onToggleSection("introduccion")}
              />

              <Text size="11px" fw={600} c="dimmed" mt={8}>
                Cuerpo y Finales
              </Text>
              <Checkbox
                size="xs"
                label="Cuerpo de Redacción (Canvas)"
                checked={sections.body}
                onChange={() => onToggleSection("body")}
              />
              <Checkbox
                size="xs"
                label="Referencias Bibliográficas"
                checked={sections.references}
                onChange={() => onToggleSection("references")}
              />
              <Checkbox
                size="xs"
                label="Anexos"
                checked={sections.annexes}
                onChange={() => onToggleSection("annexes")}
              />
            </Stack>
          </Box>
        </Stack>
      </ScrollArea>
    </Paper>
  );
};

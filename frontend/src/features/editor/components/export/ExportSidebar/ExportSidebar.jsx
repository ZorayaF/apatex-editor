// src/features/editor/components/export/ExportSidebar/ExportSidebar.jsx
import React, { useMemo } from "react";
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
  Switch,
  Badge,
} from "@mantine/core";
import {
  IconCompass,
  IconAdjustments,
  IconArrowRight,
} from "@tabler/icons-react";
import { useStore } from "@store";
import { buildDocumentPages } from "@logic/engine/document/buildDocumentPages";
import classes from "./ExportSidebar.module.css";

const SECTION_METADATA = {
  titlePage: { label: "Portada", group: "prelim" },
  contraportada: { label: "Contraportada", group: "prelim" },
  aceptacion: { label: "Aceptación", group: "prelim" },
  reglamento: { label: "Reglamento", group: "prelim" },
  dedicatoria: { label: "Dedicatoria", group: "prelim" },
  agradecimientos: { label: "Agradecimientos", group: "prelim" },
  toc: { label: "Tabla de Contenido", group: "prelim" },
  glosario: { label: "Glosario", group: "prelim" },
  resumen: { label: "Resumen", group: "prelim" },
  abstract: { label: "Abstract", group: "prelim" },
  introduccion: { label: "Introducción", group: "prelim" },
  body: { label: "Cuerpo de Redacción", group: "body" },
  references: { label: "Referencias Bibliográficas", group: "body" },
  annexes: { label: "Anexos", group: "body" },
};

export const ExportSidebar = ({
  targetPage,
  onChangeTargetPage,
  onScrollToPage,
  sections = {},
  onToggleSection,
  onSetPreset,
}) => {
  const {
    pages = [],
    blocks = [],
    sources = [],
    projectMetadata = {},
    preliminares: storePreliminares,
  } = useStore();

  const preliminares = storePreliminares || projectMetadata?.preliminares || {};
  const metadataWithPrelim = { ...projectMetadata, preliminares };

  // 1. Páginas físicas existentes en su totalidad
  const allExistingPages = useMemo(() => {
    const fullActiveSections = Object.keys(SECTION_METADATA).reduce(
      (acc, k) => {
        acc[k] = true;
        return acc;
      },
      {},
    );

    return buildDocumentPages({
      projectMetadata: metadataWithPrelim,
      canvasPages: pages,
      blocks,
      sources,
      activeSections: fullActiveSections,
    });
  }, [metadataWithPrelim, pages, blocks, sources]);

  // 2. Páginas activas según la selección actual
  const activeDocumentPages = useMemo(() => {
    return buildDocumentPages({
      projectMetadata: metadataWithPrelim,
      canvasPages: pages,
      blocks,
      sources,
      activeSections: sections,
    });
  }, [metadataWithPrelim, pages, blocks, sources, sections]);

  // 3. Secciones filtradas que realmente tienen contenido
  const availableSections = useMemo(() => {
    const sectionTypesPresent = new Set();

    allExistingPages.forEach((p) => {
      if (p.type === "portada") sectionTypesPresent.add("titlePage");
      if (p.type === "contraportada") sectionTypesPresent.add("contraportada");
      if (p.type === "aceptacion") sectionTypesPresent.add("aceptacion");
      if (p.type === "reglamento") sectionTypesPresent.add("reglamento");
      if (p.type === "dedicatoria") sectionTypesPresent.add("dedicatoria");
      if (p.type === "agradecimientos")
        sectionTypesPresent.add("agradecimientos");
      if (p.type.startsWith("toc_")) sectionTypesPresent.add("toc");
      if (p.type === "glosario") sectionTypesPresent.add("glosario");
      if (p.type === "resumen") sectionTypesPresent.add("resumen");
      if (p.type === "abstract") sectionTypesPresent.add("abstract");
      if (p.type === "introduccion") sectionTypesPresent.add("introduccion");
      if (p.type === "canvas_page") sectionTypesPresent.add("body");
      if (p.type === "referencias") sectionTypesPresent.add("references");
      if (p.type === "anexos_portada" || p.type === "anexo_item") {
        sectionTypesPresent.add("annexes");
      }
    });

    return Object.keys(SECTION_METADATA)
      .filter((key) => sectionTypesPresent.has(key))
      .map((key) => {
        const pageMatch = activeDocumentPages.find((p) => {
          if (key === "titlePage") return p.type === "portada";
          if (key === "contraportada") return p.type === "contraportada";
          if (key === "toc") return p.type === "toc_contenido";
          if (key === "body") return p.type === "canvas_page";
          if (key === "references") return p.type === "referencias";
          if (key === "annexes") return p.type === "anexos_portada";
          return p.type === key;
        });

        return {
          key,
          label: SECTION_METADATA[key].label,
          group: SECTION_METADATA[key].group,
          pageNumber: pageMatch?.pageNumber || null,
          isVisible: Boolean(sections[key]),
        };
      });
  }, [allExistingPages, activeDocumentPages, sections]);

  const prelimSections = availableSections.filter((s) => s.group === "prelim");
  const bodySections = availableSections.filter((s) => s.group === "body");

  const renderSectionItem = (item) => {
    const isChecked = item.isVisible;

    const handleCardClick = (e) => {
      // Si el clic fue en el switch, dejamos que el switch lo maneje
      if (e.target.closest(`.${classes.tightSwitch}`)) return;

      // Si la sección está visible y tiene página asignada, navegamos
      if (isChecked && item.pageNumber) {
        onScrollToPage(item.pageNumber);
      }
    };

    return (
      <div
        key={item.key}
        className={`${classes.navCard} ${!isChecked ? classes.navCardDisabled : ""}`}
        onClick={handleCardClick}
      >
        {/* Controles Izquierdos: Switch y Nombre */}
        <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <div
            className={`${classes.tightSwitch} ${isChecked ? classes.tightSwitchActive : ""}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Switch
              size="xs"
              checked={isChecked}
              onChange={(e) => {
                onToggleSection(item.key);
              }}
            />
          </div>

          <Text
            size="xs"
            fw={isChecked ? 600 : 400}
            truncate
            style={{ flex: 1 }}
          >
            {item.label}
          </Text>
        </Group>

        {/* Control Derecho: Insignia con el número de página */}
        {isChecked && item.pageNumber && (
          <Badge size="xs" variant="light" color="blue">
            p. {item.pageNumber}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <Paper className={`no-print ${classes.sidebar}`} w={290} bg="white">
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
                max={activeDocumentPages.length || 1}
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

            {/* Listado de Tarjetas */}
            <Stack gap={6}>
              {prelimSections.length > 0 && (
                <>
                  <Text size="11px" fw={600} c="dimmed" mt={4}>
                    Páginas Preliminares
                  </Text>
                  {prelimSections.map(renderSectionItem)}
                </>
              )}

              {bodySections.length > 0 && (
                <>
                  <Text size="11px" fw={600} c="dimmed" mt={8}>
                    Cuerpo y Finales
                  </Text>
                  {bodySections.map(renderSectionItem)}
                </>
              )}
            </Stack>
          </Box>
        </Stack>
      </ScrollArea>
    </Paper>
  );
};

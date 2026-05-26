// src/features/editor/components/config/preview/TableOfContents.jsx
import React from "react";
import { Box, Text, Group, Stack, Divider } from "@mantine/core";
import { useStore } from "@store";
import { generateAllLists } from "@logic/engine/tocEngine";
import { APA_CONFIG, cmToPx } from "@core/utils/measurements";

export const TableOfContents = () => {
  const { blocks, pages, projectMetadata } = useStore();
  const { margins, paper, typography } = APA_CONFIG;

  const allLists = generateAllLists(blocks, pages, projectMetadata);

  const getIndent = (level) => {
    if (level === "h1") return 0;
    if (level === "h2") return 20;
    if (level === "h3") return 40;
    return 0;
  };

  // ✅ Añadimos la propiedad "id" a la plantilla de la hoja física
  const SheetWrapper = ({ title, id, children }) => (
    <Box
      id={id} // <-- Identificador clave para el anclaje de scroll
      style={{
        width: `${cmToPx(paper.width)}px`,
        height: `${cmToPx(paper.height)}px`,
        backgroundColor: "white",
        padding: `${cmToPx(margins.top)}px ${cmToPx(margins.right)}px ${cmToPx(margins.bottom)}px ${cmToPx(margins.left)}px`,
        fontFamily: typography.family,
        boxSizing: "border-box",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        // Suaviza la transición cuando recibe foco
        transition: "outline 0.3s ease",
      }}
    >
      <Text ta="center" fw="bold" size="12pt" mb="sm">
        {title}
      </Text>

      <Group justify="flex-end" mb="md">
        <Text size="11pt" style={{ marginRight: "2px" }}>
          Pág.
        </Text>
      </Group>

      <Stack gap="xs" style={{ flex: 1 }}>
        {children}
      </Stack>
    </Box>
  );

  const ListRow = ({ text, page, indent = 0 }) => (
    <Group
      justify="space-between"
      wrap="nowrap"
      gap={4}
      style={{ paddingLeft: indent }}
    >
      <Text fw="normal" size="11pt" style={{ flexShrink: 0, maxWidth: "80%" }}>
        {text}
      </Text>
      <Box
        style={{ flexGrow: 1, borderBottom: "1px dotted #888", height: "14px" }}
      />
      <Text fw="normal" size="11pt" style={{ flexShrink: 0 }}>
        {page}
      </Text>
    </Group>
  );

  return (
    <Stack gap="xl">
      {/* 📜 LISTA 1: CONTENIDO GENERAL */}
      <SheetWrapper title="Contenido" id="toc-sheet-contenido">
        {allLists.contenido.map((entry, index) => (
          <ListRow
            key={index}
            text={entry.text}
            page={entry.page}
            indent={getIndent(entry.level)}
          />
        ))}
        {allLists.contenido.length === 0 && (
          <Text ta="center" c="dimmed" italic mt="xl">
            Los títulos aparecerán aquí automáticamente.
          </Text>
        )}
      </SheetWrapper>

      {/* 📊 LISTA 2: LISTA DE TABLAS */}
      {allLists.tablas.length > 0 && (
        <>
          <Divider
            label="Salto de página hacia Lista de Tablas"
            labelPosition="center"
            color="gray.4"
          />
          <SheetWrapper title="Lista de Tablas" id="toc-sheet-tablas">
            {allLists.tablas.map((table, index) => (
              <ListRow
                key={index}
                text={`${table.label}. ${table.title}`}
                page={table.page}
              />
            ))}
          </SheetWrapper>
        </>
      )}

      {/* 🖼️ LISTA 3: LISTA DE FIGURAS */}
      {allLists.figuras.length > 0 && (
        <>
          <Divider
            label="Salto de página hacia Lista de Figuras"
            labelPosition="center"
            color="gray.4"
          />
          <SheetWrapper title="Lista de Figuras" id="toc-sheet-figuras">
            {allLists.figuras.map((fig, index) => (
              <ListRow
                key={index}
                text={`${fig.label}. ${fig.title}`}
                page={fig.page}
              />
            ))}
          </SheetWrapper>
        </>
      )}

      {/* 📎 LISTA 4: LISTA DE ANEXOS */}
      {allLists.anexos.length > 0 && (
        <>
          <Divider
            label="Salto de página hacia Lista de Anexos"
            labelPosition="center"
            color="gray.4"
          />
          <SheetWrapper title="Lista de Anexos" id="toc-sheet-anexos">
            {allLists.anexos.map((anexo, index) => (
              <ListRow
                key={index}
                text={`${anexo.label}. ${anexo.title}`}
                page={anexo.page}
              />
            ))}
          </SheetWrapper>
        </>
      )}
    </Stack>
  );
};

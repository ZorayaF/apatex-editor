// src/features/editor/components/config/preview/TableOfContents.jsx
import { Box, Text, Group, Stack, Divider } from "@mantine/core";
import { useStore } from "@store";
import { generateAllLists } from "@logic/engine/tocEngine";
import { APA_CONFIG, cmToPx } from "@core/utils/measurements";

export const TableOfContents = () => {
  const { blocks, pages, projectMetadata } = useStore();
  const { margins, paper, typography } = APA_CONFIG;

  // Obtenemos las 4 listas procesadas por el motor
  const allLists = generateAllLists(blocks, pages, projectMetadata);

  const getIndent = (level) => {
    if (level === "h1") return 0;
    if (level === "h2") return 20;
    if (level === "h3") return 40;
    return 0;
  };

  // Plantilla de Hoja Estándar para reutilizar la estructura física
  const SheetWrapper = ({ title, children }) => (
    <Box
      style={{
        width: `${cmToPx(paper.width)}px`,
        height: `${cmToPx(paper.height)}px`, // Alto fijo por hoja
        backgroundColor: "white",
        padding: `${cmToPx(margins.top)}px ${cmToPx(margins.right)}px ${cmToPx(margins.bottom)}px ${cmToPx(margins.left)}px`,
        fontFamily: typography.family,
        boxSizing: "border-box",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Text
        ta="center"
        fw="bold"
        size="12pt"
        mb={40}
        style={{ textTransform: "uppercase" }}
      >
        {title}
      </Text>
      <Stack gap="xs" style={{ flex: 1 }}>
        {children}
      </Stack>
    </Box>
  );

  // Fila Estándar con puntos de relleno (Dot Leaders)
  const ListRow = ({ text, page, isBold, indent = 0 }) => (
    <Group
      justify="space-between"
      wrap="nowrap"
      gap={4}
      style={{ paddingLeft: indent }}
    >
      <Text
        fw={isBold ? "bold" : "normal"}
        size="11pt"
        style={{
          flexShrink: 0,
          maxWidth: "80%",
          textTransform: isBold ? "uppercase" : "none",
        }}
      >
        {text}
      </Text>
      <Box
        style={{ flexGrow: 1, borderBottom: "1px dotted #888", height: "14px" }}
      />
      <Text
        fw={isBold ? "bold" : "normal"}
        size="11pt"
        style={{ flexShrink: 0 }}
      >
        {page}
      </Text>
    </Group>
  );

  return (
    <Stack gap="xl">
      {/* 📜 LISTA 1: CONTENIDO GENERAL (Siempre Visible) */}
      <SheetWrapper title="Contenido">
        {allLists.contenido.map((entry, index) => (
          <ListRow
            key={index}
            text={entry.text}
            page={entry.page}
            isBold={entry.level === "h1"}
            indent={getIndent(entry.level)}
          />
        ))}
        {allLists.contenido.length === 0 && (
          <Text ta="center" c="dimmed" italic mt="xl">
            Los títulos aparecerán aquí automáticamente.
          </Text>
        )}
      </SheetWrapper>

      {/* 📊 LISTA 2: LISTA DE TABLAS (Opcional, si existen en el editor) */}
      {allLists.tablas.length > 0 && (
        <>
          <Divider
            label="Salto de página hacia Lista de Tablas"
            labelPosition="center"
            color="gray.4"
          />
          <SheetWrapper title="Lista de Tablas">
            {allLists.tablas.map((table, index) => (
              <ListRow
                key={index}
                text={`${table.label}. ${table.title}`}
                page={table.page}
                isBold={false}
              />
            ))}
          </SheetWrapper>
        </>
      )}

      {/* 🖼️ LISTA 3: LISTA DE FIGURAS (Opcional, si existen en el editor) */}
      {allLists.figuras.length > 0 && (
        <>
          <Divider
            label="Salto de página hacia Lista de Figuras"
            labelPosition="center"
            color="gray.4"
          />
          <SheetWrapper title="Lista de Figuras">
            {allLists.figuras.map((fig, index) => (
              <ListRow
                key={index}
                text={`${fig.label}. ${fig.title}`}
                page={fig.page}
                isBold={false}
              />
            ))}
          </SheetWrapper>
        </>
      )}

      {/* 📎 LISTA 4: LISTA DE ANEXOS (Opcional, si la sección está encendida y tiene ítems) */}
      {allLists.anexos.length > 0 && (
        <>
          <Divider
            label="Salto de página hacia Lista de Anexos"
            labelPosition="center"
            color="gray.4"
          />
          <SheetWrapper title="Lista de Anexos">
            {allLists.anexos.map((anexo, index) => (
              <ListRow
                key={index}
                text={`${anexo.label}. ${anexo.title}`}
                page={anexo.page}
                isBold={false}
              />
            ))}
          </SheetWrapper>
        </>
      )}
    </Stack>
  );
};

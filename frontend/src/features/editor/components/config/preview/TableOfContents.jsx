import React from "react";
import { Box, Text, Group, Stack } from "@mantine/core";
import { useStore } from "@store";
import { generateTOCEntries } from "@logic/engine/tocEngine";
import { APA_CONFIG, cmToPx } from "@core/utils/measurements";

export const TableOfContents = () => {
  const { blocks, pages, projectMetadata } = useStore();
  const { margins, paper, typography } = APA_CONFIG;

  const entries = generateTOCEntries(blocks, pages, projectMetadata);

  const getIndent = (level) => {
    if (level === "h1") return 0;
    if (level === "h2") return 20;
    if (level === "h3") return 40;
    return 0;
  };

  return (
    <Box
      style={{
        width: `${cmToPx(paper.width)}px`,
        minHeight: `${cmToPx(paper.height)}px`,
        backgroundColor: "white",
        padding: `${cmToPx(margins.top)}px ${cmToPx(margins.right)}px ${cmToPx(margins.bottom)}px ${cmToPx(margins.left)}px`,
        fontFamily: typography.family,
        boxSizing: "border-box",
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      }}
    >
      <Text
        ta="center"
        fw="bold"
        size="12pt"
        mb={40}
        style={{ textTransform: "uppercase" }}
      >
        Contenido
      </Text>

      <Stack gap="xs">
        {entries.map((entry, index) => (
          <Group
            key={index}
            justify="space-between"
            wrap="nowrap"
            gap={4}
            style={{ paddingLeft: getIndent(entry.level) }}
          >
            <Text
              fw={entry.level === "h1" ? "bold" : "normal"}
              size="11pt"
              style={{
                flexShrink: 0,
                maxWidth: "80%",
                textTransform: entry.level === "h1" ? "uppercase" : "none",
              }}
            >
              {entry.text}
            </Text>

            {/* Los puntos suspensivos que llenan el espacio */}
            <Box
              style={{
                flexGrow: 1,
                borderBottom: "1px dotted #888",
                height: "14px",
              }}
            />

            <Text
              fw={entry.level === "h1" ? "bold" : "normal"}
              size="11pt"
              style={{ flexShrink: 0 }}
            >
              {entry.page}
            </Text>
          </Group>
        ))}

        {entries.length === 0 && (
          <Text ta="center" c="dimmed" italic mt="xl">
            Los títulos h1, h2 y h3 aparecerán aquí automáticamente.
          </Text>
        )}
      </Stack>
    </Box>
  );
};

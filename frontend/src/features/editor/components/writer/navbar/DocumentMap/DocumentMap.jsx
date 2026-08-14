// src/features/editor/components/writer/navbar/DocumentMap/DocumentMap.jsx
import React, { useMemo } from "react";
import {
  Box,
  Title,
  Text,
  Stack,
  ScrollArea,
  Button,
  Group,
  Tooltip,
  Badge,
  ActionIcon,
} from "@mantine/core";
import {
  IconCompass,
  IconFocusCentered,
  IconEye,
  IconHash,
} from "@tabler/icons-react";
import { useStore } from "@store";

export const DocumentMap = () => {
  const {
    blocks = [],
    focusedChapterId,
    setFocusedChapter,
    setSelectedBlockId,
  } = useStore();

  // 1. Calculamos los encabezados con su numeración formal APA (1., 1.1, 1.1.1...)
  const numberedHeadings = useMemo(() => {
    const headings = blocks.filter((b) =>
      ["h1", "h2", "h3", "h4", "h5"].includes(b.type),
    );

    const counters = [0, 0, 0, 0, 0];

    return headings.map((h) => {
      const level = parseInt(h.type.replace("h", ""), 10) || 1;
      const levelIndex = level - 1;

      counters[levelIndex]++;
      for (let i = levelIndex + 1; i < counters.length; i++) {
        counters[i] = 0;
      }

      const numbering = counters.slice(0, levelIndex + 1).join(".") + ".";
      const cleanText =
        h.content?.replace(/<[^>]*>?/gm, "").trim() || "Sin título";

      return {
        ...h,
        level,
        numbering,
        displayTitle: cleanText,
      };
    });
  }, [blocks]);

  // 2. Navegar al bloque seleccionado en el lienzo
  const handleNavigateToBlock = (id) => {
    setSelectedBlockId(id);
  };

  return (
    <Box
      h="100%"
      w="100%"
      p="xs"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Cabecera */}
      <Group
        justify="space-between"
        align="center"
        mb="xs"
        px={4}
        style={{ flexShrink: 0 }}
      >
        <Group gap={6} align="center">
          <Title order={5} c="gray.8">
            Estructura
          </Title>
          {numberedHeadings.length > 0 && (
            <Badge size="xs" variant="light" color="gray">
              {numberedHeadings.length}
            </Badge>
          )}
        </Group>

        {focusedChapterId && (
          <Tooltip
            label="Mostrar todo el documento"
            withArrow
            position="bottom"
          >
            <Button
              size="compact-xs"
              variant="light"
              color="blue"
              leftSection={<IconEye size={12} />}
              onClick={() => setFocusedChapter(null)}
            >
              Ver todo
            </Button>
          </Tooltip>
        )}
      </Group>

      {/* Contenido / Esquema */}
      <ScrollArea
        style={{ flex: 1, minHeight: 0 }}
        type="hover"
        scrollbarSize={6}
      >
        {numberedHeadings.length === 0 ? (
          <Stack align="center" gap="xs" mt="xl" px="sm" c="dimmed" ta="center">
            <IconCompass size={32} stroke={1.2} style={{ opacity: 0.35 }} />
            <Text size="xs" fw={600} c="gray.7">
              Sin títulos creados
            </Text>
            <Text size="11px" c="dimmed" style={{ lineHeight: 1.4 }}>
              Agrega títulos (H1 a H5) para generar el mapa de navegación y
              activar el modo enfoque por capítulos.
            </Text>
          </Stack>
        ) : (
          <Stack gap={2} pt={2} pr="xs">
            {numberedHeadings.map((h) => {
              const isH1 = h.level === 1;
              const isFocused = focusedChapterId === h.id;
              const indentPadding = (h.level - 1) * 14 + 6;

              return (
                <Group
                  key={h.id}
                  gap={4}
                  wrap="nowrap"
                  style={{ width: "100%" }}
                >
                  <Button
                    variant={isFocused ? "filled" : isH1 ? "light" : "subtle"}
                    color={isFocused ? "blue" : isH1 ? "gray" : "dark"}
                    size="xs"
                    style={{ flex: 1, minWidth: 0 }}
                    justify="flex-start"
                    pl={indentPadding}
                    leftSection={
                      <Text
                        size="11px"
                        fw={700}
                        c={isFocused ? "white" : "dimmed"}
                        style={{ fontFamily: "monospace" }}
                      >
                        {h.numbering}
                      </Text>
                    }
                    onClick={() => handleNavigateToBlock(h.id)}
                    styles={{
                      inner: { justifyContent: "flex-start" },
                      label: {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: isH1 ? 600 : 400,
                        fontSize: isH1 ? "12px" : "11px",
                      },
                    }}
                  >
                    {h.displayTitle}
                  </Button>

                  {/* Botón de Enfoque exclusivo para Capítulos H1 */}
                  {isH1 && (
                    <Tooltip
                      label={
                        isFocused
                          ? "Quitar enfoque"
                          : "Enfocar solo este capítulo"
                      }
                      withArrow
                      position="right"
                    >
                      <ActionIcon
                        size="sm"
                        variant={isFocused ? "filled" : "subtle"}
                        color={isFocused ? "blue" : "gray"}
                        onClick={() =>
                          setFocusedChapter(isFocused ? null : h.id)
                        }
                      >
                        <IconFocusCentered size={14} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              );
            })}
          </Stack>
        )}
      </ScrollArea>
    </Box>
  );
};

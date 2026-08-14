// src/features/editor/components/writer/navbar/DocumentMap/DocumentMap.jsx
import React, { useMemo, useDeferredValue } from "react";
import {
  ScrollArea,
  NavLink,
  Stack,
  Text,
  Group,
  ThemeIcon,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconListSearch, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useStore } from "@store";
import { useShallow } from "zustand/react/shallow";

export const DocumentMap = () => {
  const {
    pages = [],
    blocks = [],
    selectedBlockId,
    setSelectedBlockId,
    focusedChapterId,
    setFocusedChapterId,
  } = useStore(
    useShallow((state) => ({
      pages: state.pages,
      blocks: state.blocks,
      selectedBlockId: state.selectedBlockId,
      setSelectedBlockId: state.setSelectedBlockId,
      focusedChapterId: state.focusedChapterId,
      setFocusedChapterId: state.setFocusedChapterId,
    })),
  );

  const deferredPages = useDeferredValue(pages);
  const deferredBlocks = useDeferredValue(blocks);

  // Calculamos la numeración formal multinivel (1., 1.1., 1.1.1.) únicamente para H1-H3
  const numberedHeadings = useMemo(() => {
    const blockMap = new Map(deferredBlocks.map((b) => [b.id, b]));
    const orderedBlockIds = deferredPages.flatMap((p) => p.blockIds);

    // Contadores para niveles h1, h2, h3
    const counters = [0, 0, 0];

    return orderedBlockIds
      .map((id) => blockMap.get(id))
      .filter((b) => b && /^h[1-3]$/.test(b.type)) // <-- Solo títulos h1, h2 y h3
      .map((b) => {
        const level = parseInt(b.type.replace("h", ""), 10) || 1;
        const index = level - 1;

        // Incrementamos el contador del nivel actual
        counters[index]++;
        // Reseteamos todos los contadores de los subniveles inferiores
        for (let i = index + 1; i < counters.length; i++) {
          counters[i] = 0;
        }

        // Generamos la numeración según la profundidad (ej: "1.", "1.1.", "1.1.1.")
        const number = counters.slice(0, level).join(".") + ".";

        const cleanText = b.content
          ? b.content.replace(/<[^>]*>?/gm, "").trim()
          : "";

        return {
          id: b.id,
          text: cleanText || `Título nivel ${level}`,
          type: b.type,
          level,
          number,
        };
      });
  }, [deferredPages, deferredBlocks]);

  return (
    <Stack gap={0} h="100%" style={{ overflow: "hidden" }}>
      {/* Encabezado */}
      <Group p="xs" pb={8} gap={8} justify="space-between">
        <Group gap={8}>
          <ThemeIcon variant="subtle" size="sm" color="blue">
            <IconListSearch size={16} />
          </ThemeIcon>
          <Text
            fw={800}
            size="10px"
            c="dimmed"
            style={{ letterSpacing: "0.8px" }}
          >
            ÍNDICE DEL DOCUMENTO
          </Text>
        </Group>

        {focusedChapterId && (
          <Tooltip label="Ver todo el documento" withArrow position="bottom">
            <ActionIcon
              size="xs"
              variant="light"
              color="blue"
              onClick={() => setFocusedChapterId(null)}
            >
              <IconEyeOff size={12} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>

      {/* Lista de Encabezados */}
      <ScrollArea scrollbarSize={4} offsetScrollbars style={{ flex: 1 }}>
        <Stack gap={1} p={4}>
          {numberedHeadings.length === 0 ? (
            <Text size="11px" c="dimmed" ta="center" py="xl" px="xs">
              Sin títulos creados. Agrega títulos H1 a H3 en el texto para ver
              el esquema.
            </Text>
          ) : (
            numberedHeadings.map((h) => {
              const isFocused = focusedChapterId === h.id;
              // Indentación proporcional al nivel jerárquico
              const paddingLeft = (h.level - 1) * 14 + 6;

              return (
                <NavLink
                  key={h.id}
                  label={h.text}
                  active={h.id === selectedBlockId}
                  onClick={() => setSelectedBlockId(h.id)}
                  h={24}
                  py={0}
                  pl={paddingLeft}
                  pr={4}
                  leftSection={
                    <Text
                      fz={11}
                      fw={800}
                      c={isFocused ? "blue.6" : "blue.8"}
                      lh={1}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: 16,
                      }}
                    >
                      {h.number}
                    </Text>
                  }
                  rightSection={
                    h.type === "h1" && (
                      <Tooltip
                        label={
                          isFocused
                            ? "Mostrar todo el documento"
                            : "Enfocar solo este capítulo"
                        }
                        position="right"
                        withArrow
                      >
                        <ActionIcon
                          size={18}
                          variant={isFocused ? "filled" : "subtle"}
                          color="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFocusedChapterId(isFocused ? null : h.id);
                          }}
                        >
                          {isFocused ? (
                            <IconEyeOff size={11} />
                          ) : (
                            <IconEye size={11} />
                          )}
                        </ActionIcon>
                      </Tooltip>
                    )
                  }
                  styles={{
                    root: {
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "4px",
                      minHeight: "unset",
                    },
                    label: {
                      fontSize: "11px",
                      lineHeight: 1,
                      fontWeight: h.type === "h1" ? 700 : 400,
                      fontStyle: h.level >= 2 ? "italic" : "normal",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      paddingTop: "1px",
                    },
                    section: {
                      marginRight: 6,
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    },
                  }}
                />
              );
            })
          )}
        </Stack>
      </ScrollArea>
    </Stack>
  );
};

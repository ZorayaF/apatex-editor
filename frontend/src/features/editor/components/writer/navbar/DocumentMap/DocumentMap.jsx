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

  // 1. Calculamos la numeración formal basada en el orden de las páginas
  const numberedHeadings = useMemo(() => {
    const blockMap = new Map(deferredBlocks.map((b) => [b.id, b]));
    const orderedBlockIds = deferredPages.flatMap((p) => p.blockIds);
    let h1 = 0;
    let h2 = 0;

    return orderedBlockIds
      .map((id) => blockMap.get(id))
      .filter((b) => b && (b.type === "h1" || b.type === "h2"))
      .map((b) => {
        let num = b.type === "h1" ? `${++h1}.` : `${h1}.${++h2}.`;
        if (b.type === "h1") h2 = 0;

        // Limpiamos etiquetas HTML por si el título contiene estilos
        const cleanText = b.content
          ? b.content.replace(/<[^>]*>?/gm, "").trim()
          : "Sin título";

        return {
          id: b.id,
          text: cleanText || "Sin título",
          type: b.type,
          number: num,
        };
      });
  }, [deferredPages, deferredBlocks]);

  return (
    <Stack gap={0} h="100%" style={{ overflow: "hidden" }}>
      {/* Encabezado del panel */}
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
          <Tooltip
            label="Restablecer vista completa"
            withArrow
            position="bottom"
          >
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

      {/* Lista de encabezados */}
      <ScrollArea scrollbarSize={4} offsetScrollbars style={{ flex: 1 }}>
        <Stack gap={1} p={4}>
          {numberedHeadings.length === 0 ? (
            <Text size="11px" c="dimmed" ta="center" py="xl" px="xs">
              Sin títulos creados. Agrega encabezados H1 o H2 para ver el
              esquema.
            </Text>
          ) : (
            numberedHeadings.map((h) => {
              const isFocused = focusedChapterId === h.id;

              return (
                <NavLink
                  key={h.id}
                  label={h.text}
                  active={h.id === selectedBlockId}
                  onClick={() => setSelectedBlockId(h.id)}
                  h={24}
                  py={0}
                  pl={h.type === "h2" ? 22 : 6}
                  pr={4}
                  leftSection={
                    <Text
                      fz={11}
                      fw={800}
                      c="blue.8"
                      lh={1}
                      style={{ display: "flex", alignItems: "center" }}
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
                            <IconEyeOff size={12} />
                          ) : (
                            <IconEye size={12} />
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

// src/features/editor/components/navbar/DocumentMap.jsx
import React, { useCallback, useMemo, useDeferredValue } from "react";
import {
  ScrollArea,
  NavLink,
  Stack,
  Text,
  Group,
  ThemeIcon,
  ActionIcon,
} from "@mantine/core";
import { IconListSearch, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useStore } from "@store";
import { useShallow } from "zustand/react/shallow";

export const DocumentMap = () => {
  const {
    pages,
    blocks,
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
        return {
          id: b.id,
          text: b.content || "Sin título",
          type: b.type,
          number: num,
        };
      });
  }, [deferredPages, deferredBlocks]);

  return (
    <Stack gap={0} h="100%">
      <Group p="xs" pb={8} gap={8}>
        <ThemeIcon variant="subtle" size="sm" color="blue">
          <IconListSearch size={16} />
        </ThemeIcon>
        <Text
          fw={800}
          size="10px"
          c="dimmed"
          style={{ letterSpacing: "0.8px" }}
        >
          ESTRUCTURA
        </Text>
      </Group>

      <ScrollArea scrollbarSize={4} offsetScrollbars>
        <Stack gap={1} p={4}>
          {numberedHeadings.map((h) => {
            const isFocused = focusedChapterId === h.id;

            return (
              <NavLink
                key={h.id}
                label={h.text}
                active={h.id === selectedBlockId}
                onClick={() => setSelectedBlockId(h.id)}
                // 1. FORZAMOS ALTURA MÍNIMA Y PADDING CERO
                h={22} // Altura fija muy pequeña
                py={0} // Sin espacio arriba ni abajo
                pl={h.type === "h2" ? 22 : 6}
                pr={4}
                // 2. NÚMERO ALINEADO
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
                // 3. OJO ALINEADO
                rightSection={
                  h.type === "h1" && (
                    <ActionIcon
                      size={16} // Tamaño manual para que no estire el bloque
                      variant={isFocused ? "filled" : "subtle"}
                      color="blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFocusedChapterId(isFocused ? null : h.id);
                      }}
                    >
                      {isFocused ? (
                        <IconEyeOff size={10} />
                      ) : (
                        <IconEye size={10} />
                      )}
                    </ActionIcon>
                  )
                }
                // 4. EL SECRETO: Overrides de CSS interno de Mantine
                styles={{
                  root: {
                    display: "flex",
                    alignItems: "center", // Centrado vertical puro
                    borderRadius: "2px",
                    minHeight: "unset", // Matamos el min-height por defecto de Mantine
                  },
                  label: {
                    fontSize: "11px",
                    lineHeight: 1, // Altura de línea mínima
                    fontWeight: h.type === "h1" ? 700 : 400,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    paddingTop: "1px", // Ajuste fino para centrar visualmente la tipografía
                  },
                  section: {
                    marginRight: 6,
                    display: "flex",
                    alignItems: "center",
                    height: "100%", // Que la sección ocupe toda la fila
                  },
                }}
              />
            );
          })}
        </Stack>
      </ScrollArea>
    </Stack>
  );
};

import React from "react";
import {
  AppShell,
  Box,
  ActionIcon,
  Tooltip,
  Group,
  ScrollArea,
} from "@mantine/core";
import {
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
} from "@tabler/icons-react";
import { Header } from "../header";
import { Canvas } from "../canvas/Canvas";
import { Inspector } from "../inspector";
// 1. Importamos el store
import { useStore } from "../../store";

export const EditorShell = () => {
  // 2. Traemos el estado global en lugar del local
  const isInspectorOpen = useStore((state) => state.isInspectorOpen);
  const setInspectorOpen = useStore((state) => state.setInspectorOpen);

  return (
    <AppShell
      header={{ height: 70 }}
      aside={{
        width: 350,
        breakpoint: "md",
        // 3. Ahora depende del Store global
        collapsed: { desktop: !isInspectorOpen },
      }}
      padding="0"
    >
      <AppShell.Header style={{ zIndex: 102 }}>
        <Group
          h="100%"
          px="md"
          justify="space-between"
          align="center"
          wrap="nowrap"
        >
          {/* El Header ocupa el espacio restante */}
          <Box style={{ flex: 1 }}>
            <Header />
          </Box>

          {/* Botón Maestro de Visibilidad */}
          <Tooltip
            label={
              isInspectorOpen ? "Ocultar propiedades" : "Mostrar propiedades"
            }
          >
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              // 4. Cambiamos el estado global
              onClick={() => setInspectorOpen(!isInspectorOpen)}
            >
              {isInspectorOpen ? (
                <IconLayoutSidebarRightCollapse size={24} />
              ) : (
                <IconLayoutSidebarRightExpand size={24} />
              )}
            </ActionIcon>
          </Tooltip>
        </Group>
      </AppShell.Header>

      <AppShell.Main bg="gray.2">
        <ScrollArea h="calc(100vh - 70px)" scrollbarSize={12} offsetScrollbars>
          <Box
            py={60}
            px={100}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "40px",
            }}
          >
            <Canvas />
          </Box>
        </ScrollArea>
      </AppShell.Main>

      {/* Solo mostramos el Aside si el store dice que está abierto */}
      <AppShell.Aside style={{ zIndex: 101 }}>
        <Inspector />
      </AppShell.Aside>
    </AppShell>
  );
};

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
import { useStore } from "../../store";
import "../../styles/editor.css";
import { APA_CONFIG } from "@core/utils/measurements";

export const EditorShell = () => {
  const isInspectorOpen = useStore((state) => state.isInspectorOpen);
  const setInspectorOpen = useStore((state) => state.setInspectorOpen);

  // --- INYECCIÓN DE LA "FUENTE DE LA VERDAD" ---
  // Estas variables permiten que el CSS sea dinámico basado en measurements.js
  const dynamicStyles = {
    "--apa-font": APA_CONFIG.typography.family,
    "--apa-size": `${APA_CONFIG.typography.size}pt`,
    "--apa-line-height": APA_CONFIG.typography.lineHeight,
    "--apa-indent": `${APA_CONFIG.typography.indent}cm`,
  };

  return (
    <AppShell
      header={{ height: 70 }}
      aside={{
        width: 350,
        breakpoint: "md",
        collapsed: { desktop: !isInspectorOpen },
      }}
      padding="0"
      // Aplicamos los estilos dinámicos aquí para que todo el árbol los herede
      style={dynamicStyles}
    >
      <AppShell.Header style={{ zIndex: 102 }}>
        <Group
          h="100%"
          px="md"
          justify="space-between"
          align="center"
          wrap="nowrap"
        >
          <Box style={{ flex: 1 }}>
            <Header />
          </Box>

          <Tooltip
            label={
              isInspectorOpen ? "Ocultar propiedades" : "Mostrar propiedades"
            }
          >
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
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

      <AppShell.Aside style={{ zIndex: 101 }}>
        <Inspector />
      </AppShell.Aside>
    </AppShell>
  );
};

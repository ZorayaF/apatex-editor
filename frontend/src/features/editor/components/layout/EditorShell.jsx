import React, { useState } from "react";
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

export const EditorShell = () => {
  const [inspectorOpened, setInspectorOpened] = useState(true);

  return (
    <AppShell
      header={{ height: 70 }}
      aside={{
        width: 350,
        breakpoint: "md",
        collapsed: { desktop: !inspectorOpened },
      }}
      padding="0"
    >
      <AppShell.Header style={{ zIndex: 102 }}>
        <Group h="100%" px="md" justify="space-between" align="center">
          <Header />
          <Tooltip
            label={
              inspectorOpened ? "Ocultar propiedades" : "Mostrar propiedades"
            }
          >
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={() => setInspectorOpened(!inspectorOpened)}
            >
              {inspectorOpened ? (
                <IconLayoutSidebarRightCollapse size={24} />
              ) : (
                <IconLayoutSidebarRightExpand size={24} />
              )}
            </ActionIcon>
          </Tooltip>
        </Group>
      </AppShell.Header>

      <AppShell.Main bg="gray.2">
        {/* ScrollArea: El ÚNICO lugar donde debe haber scroll */}
        <ScrollArea h="calc(100vh - 70px)" scrollbarSize={12} offsetScrollbars>
          <Box
            py={60} // Espacio arriba y abajo del documento
            px={100} // Padding lateral GENEROSO para que el outline azul no se corte
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "40px", // Espacio entre páginas (reemplaza el margin de Page)
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

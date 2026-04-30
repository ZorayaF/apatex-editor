import React from "react";
import { Box, Stack, ScrollArea } from "@mantine/core";
import { Canvas } from "@writer/canvas/Canvas";
import { WriterToolbar } from "@writer/header/WriterToolbar";

export const WritingView = () => {
  return (
    <Stack gap={0} h="100%">
      {/* 1. BARRA DE HERRAMIENTAS (Fija) */}
      <Box
        py="xs"
        bg="white"
        style={{ borderBottom: "1px solid #e9ecef", zIndex: 10 }}
      >
        <WriterToolbar />
      </Box>

      {/* 2. ÁREA DE LAS HOJAS (Scroll Independiente) */}
      {/* Usamos flex: 1 para que tome todo el alto restante después del toolbar */}
      <ScrollArea style={{ flex: 1 }} offsetScrollbars type="auto">
        <Box
          py={60}
          px={40}
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
    </Stack>
  );
};

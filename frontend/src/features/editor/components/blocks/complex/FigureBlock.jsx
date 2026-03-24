import React from "react";
import { Box, Text, Image, Center } from "@mantine/core";
import { useStore } from "@store";
import { APA_CONFIG } from "@core/utils/measurements";

export const FigureBlock = ({ id, url, title, note, width = 100 }) => {
  const { blocks, setSelectedBlockId } = useStore();

  // Numeración automática
  const figureNumber =
    blocks.filter((b) => b.type === "figure").findIndex((b) => b.id === id) + 1;

  return (
    <Box
      w="100%"
      py="md"
      onClick={() => setSelectedBlockId(id)}
      style={{ cursor: "default", fontFamily: "var(--apa-font)" }}
    >
      <Text fw={700} style={{ fontSize: "var(--apa-size)" }} mb={0}>
        Figura {figureNumber}
      </Text>

      <Text fs="italic" style={{ fontSize: "var(--apa-size)" }} mb="sm">
        {title || "Título de la figura"}
      </Text>

      <Center mb="xs">
        {url ? (
          <Image
            src={url}
            alt={title}
            radius="xs"
            fit="contain"
            // --- APLICAMOS EL ANCHO DINÁMICO ---
            style={{ width: `${width}%`, transition: "width 0.2s ease" }}
          />
        ) : (
          <Box
            h={150}
            w="100%"
            bg="gray.1"
            style={{
              border: "1px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text c="dimmed" size="xs">
              Carga una imagen desde el Inspector
            </Text>
          </Box>
        )}
      </Center>

      {note && (
        <Text
          style={{ fontSize: "calc(var(--apa-size) - 2pt)", textAlign: "left" }}
        >
          {note}
        </Text>
      )}
    </Box>
  );
};

import React from "react";
import { Box, Title, Stack } from "@mantine/core";
import { useStore } from "@store";
import { renderSourceAPA } from "@logic/engine/bibliographyRenderer";
import { APA_CONFIG, cmToPx } from "@core/utils/measurements";
import { DOCUMENT_THEME } from "@logic/rules/documentStyles";

export const BibliographyPreview = () => {
  const { blocks, sources } = useStore();

  // 1. Lógica de escaneo (se mantiene igual)
  const usedIds = Array.from(
    new Set(
      blocks.flatMap((b) => {
        const matches = b.content?.matchAll(/\(\(ref:([\w-]+)/g);
        return matches ? Array.from(matches, (m) => m[1]) : [];
      }),
    ),
  );

  const usedSources = sources
    .filter((s) => usedIds.includes(s.id))
    .sort((a, b) => (a.author || "").localeCompare(b.author || ""));

  // Estilos base reutilizados
  const { margins, paper, typography } = APA_CONFIG;
  const { h1 } = DOCUMENT_THEME.blocks;

  return (
    <Box
      style={{
        width: `${cmToPx(paper.width)}px`,
        minHeight: `${cmToPx(paper.height)}px`,
        backgroundColor: "white",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        paddingTop: `${cmToPx(margins.top)}px`,
        paddingBottom: `${cmToPx(margins.bottom)}px`,
        paddingLeft: `${cmToPx(margins.left)}px`,
        paddingRight: `${cmToPx(margins.right)}px`,
        boxSizing: "border-box",
        fontFamily: typography.family,
        fontSize: `${typography.size}pt`,
        lineHeight: typography.lineHeight,
      }}
    >
      {/* TÍTULO: Centrado, Negrita, Tamaño 12pt */}
      <Title
        order={1}
        style={{
          ...h1,
          fontSize: `${typography.size}pt`, // Forzamos 12pt según tu instrucción
          marginBottom: "2em", // Espacio antes de la primera referencia
        }}
      >
        Referencias
      </Title>

      {/* LISTA DE REFERENCIAS CON SANGRÍA FRANCESA */}
      <Stack gap="md">
        {usedSources.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "#666",
              fontStyle: "italic",
            }}
          >
            Las referencias aparecerán aquí automáticamente cuando insertes
            citas en el texto.
          </p>
        ) : (
          usedSources.map((source) => (
            <div
              key={source.id}
              style={{
                textAlign: "justify",
                // --- LA MAGIA DE LA SANGRÍA FRANCESA ---
                paddingLeft: `${typography.indent}cm`, // 1.27cm
                textIndent: `-${typography.indent}cm`, // Negativo para sacar la primera línea
                margin: 0,
              }}
              dangerouslySetInnerHTML={{ __html: renderSourceAPA(source) }}
            />
          ))
        )}
      </Stack>
    </Box>
  );
};

// src/features/editor/components/config/preview/AnnexPagePreview.jsx
import React from "react";
import { Box, Text, Stack, Image, Anchor, Table } from "@mantine/core";
import { APA_CONFIG, cmToPx } from "@core/utils/measurements";

export const AnnexPagePreview = ({ item }) => {
  const { paper, margins, typography } = APA_CONFIG;
  const isCenteredType = ["image", "table", "links"].includes(item?.type);

  const pageStyle = {
    width: `${cmToPx(paper.width)}px`,
    height: `${cmToPx(paper.height)}px`,
    backgroundColor: "white",
    padding: `${cmToPx(margins.top)}px ${cmToPx(margins.right)}px ${cmToPx(margins.bottom)}px ${cmToPx(margins.left)}px`,
    boxSizing: "border-box",
    fontFamily: typography.family,
    fontSize: `${typography.size}pt`,
    lineHeight: 2,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: isCenteredType ? "center" : "flex-start",
  };

  const renderAnnexBody = () => {
    switch (item?.type) {
      case "image":
        return (
          <Stack gap="xs" align="center" mt="md">
            <Box
              style={{
                maxWidth: "100%",
                maxHeight: "420px",
                overflow: "hidden",
              }}
            >
              <Image
                src={
                  item.contentImage?.fileUrl ||
                  "https://placehold.co/600x400?text=Sin+Imagen"
                }
                alt={item.title}
                fit="contain"
              />
            </Box>
          </Stack>
        );

      case "table":
        const tableData = item.contentTable || [];
        if (tableData.length === 0) return null;

        // Separamos la primera fila (Cabecera) de las filas de datos
        const headers = tableData[0];
        const rows = tableData.slice(1);

        return (
          <Box
            mt="md"
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Table
              variant="unstyled"
              style={{
                borderTop: "2px solid black",
                borderBottom: "2px solid black",
                width: "100%",
                fontSize: "11pt",
              }}
            >
              <Table.Thead style={{ borderBottom: "1px solid black" }}>
                <Table.Tr>
                  {headers.map((h, i) => (
                    <Table.Th key={i} style={{ textAlign: "left" }}>
                      <Text fw="bold" size="11pt">
                        {h || "..."}
                      </Text>
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((row, rIdx) => (
                  <Table.Tr
                    key={rIdx}
                    style={{
                      borderBottom:
                        rIdx === rows.length - 1 ? "none" : "1px solid #f1f3f5",
                    }}
                  >
                    {row.map((cell, cIdx) => (
                      <Table.Td key={cIdx}>
                        <Text size="11pt">{cell || " "}</Text>
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        );

      case "links":
        return (
          <Stack gap="xs" mt="md" align="center">
            {item.contentLinks?.map((link, idx) => (
              <Anchor
                key={idx}
                href={link.url}
                target="_blank"
                underline="hover"
                fw="bold"
                c="blue.7"
              >
                {link.label || link.url}
              </Anchor>
            ))}
          </Stack>
        );

      case "text":
      default:
        return (
          <Text
            style={{ textAlign: "justify", whiteSpace: "pre-wrap" }}
            mt="md"
          >
            {item?.contentText}
          </Text>
        );
    }
  };

  return (
    <Box style={pageStyle}>
      <Stack gap={2} align="center" style={{ width: "100%" }} mb="lg">
        <Text ta="center" fw="bold">
          Anexo {item?.id || "A"}. {item?.title}
        </Text>
      </Stack>

      <Box style={{ width: "100%" }}>{renderAnnexBody()}</Box>

      {/* NOTA REGLAMENTARIA AL PIE: Se renderiza de forma limpia usando la prop de descripción */}
      {item?.description && (
        <Text
          style={{
            textAlign: "justify",
            fontWeight: "normal",
            lineHeight: 1.3,
          }}
          size="10pt"
          mt="md"
          fs="italic"
        >
          Nota. {item.description}
        </Text>
      )}
    </Box>
  );
};

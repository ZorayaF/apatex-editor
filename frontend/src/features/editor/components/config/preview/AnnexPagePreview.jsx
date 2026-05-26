// src/features/editor/components/config/preview/AnnexPagePreview.jsx
import React from "react";
import { Box, Text, Stack, Image, Anchor, Table } from "@mantine/core";
import { APA_CONFIG, cmToPx } from "@core/utils/measurements";

export const AnnexPagePreview = ({ item }) => {
  const { paper, margins, typography } = APA_CONFIG;

  // Evaluamos si el tipo de anexo requiere centrado vertical absoluto en la hoja
  // (Las tablas, imágenes y links se benefician de estar centrados verticalmente si son cortos)
  const isCenteredType = ["image", "table", "links"].includes(item?.type);

  const pageStyle = {
    width: `${cmToPx(paper.width)}px`,
    height: `${cmToPx(paper.height)}px`,
    backgroundColor: "white",
    // El padding superior aplica exactamente los 2.54 cm reglamentarios del borde
    padding: `${cmToPx(margins.top)}px ${cmToPx(margins.right)}px ${cmToPx(margins.bottom)}px ${cmToPx(margins.left)}px`,
    boxSizing: "border-box",
    fontFamily: typography.family,
    fontSize: `${typography.size}pt`,
    lineHeight: 2,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    // Si es un anexo de tipo visual/corto, lo centramos verticalmente en la hoja
    justifyContent: isCenteredType ? "center" : "flex-start",
    position: "relative",
  };

  const renderAnnexBody = () => {
    switch (item?.type) {
      case "image":
        return (
          <Stack gap="xs" align="center" mt="md">
            <Box
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                overflow: "hidden",
              }}
            >
              <Image
                src={
                  item.contentImage?.fileUrl ||
                  "https://placehold.co/600x400?text=Previsualizaci%C3%B3n+de+Imagen"
                }
                alt={item.title}
                fit="contain"
              />
            </Box>
            {item.contentImage?.hasSource && item.contentImage?.sourceText && (
              <Text
                size="sm"
                fs="italic"
                ta="center"
                style={{ width: "100%", lineHeight: 1.2 }}
              >
                Nota. Tomado de {item.contentImage.sourceText}.
              </Text>
            )}
          </Stack>
        );

      case "links":
        return (
          <Stack gap="xs" mt="md" align="center">
            <Text size="sm" fs="italic" c="dimmed" mb={5}>
              (Clic en el nombre para redireccionar a la entrevista)
            </Text>
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

      case "table":
        return (
          <Box mt="md" style={{ display: "flex", justifyContent: "center" }}>
            <Table
              variant="unstyled"
              style={{
                borderTop: "2px solid black",
                borderBottom: "2px solid black",
                width: "80%",
              }}
            >
              <Table.Thead style={{ borderBottom: "1px solid black" }}>
                <Table.Tr>
                  <Table.Th>
                    <Text fw="bold">Variable / Criterio</Text>
                  </Table.Th>
                  <Table.Th>
                    <Text fw="bold">Frecuencia</Text>
                  </Table.Th>
                  <Table.Th>
                    <Text fw="bold">Porcentaje</Text>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr style={{ borderBottom: "1px solid #eee" }}>
                  <Table.Td>Muestra A</Table.Td>
                  <Table.Td>45</Table.Td>
                  <Table.Td>60%</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Muestra B</Table.Td>
                  <Table.Td>30</Table.Td>
                  <Table.Td>40%</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Box>
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
      {/* ENCABEZADO REGLAMENTARIO: Mayúscula inicial y centrado horizontalmente */}
      <Stack gap={2} align="center" style={{ width: "100%" }}>
        <Text ta="center" fw="bold">
          Anexo {item?.id || "A"}. {item?.title}
        </Text>

        {item?.description && (
          <Text
            style={{
              textAlign: isCenteredType ? "center" : "justify",
              fontWeight: "normal",
            }}
            size="sm"
          >
            {item.description}
          </Text>
        )}
      </Stack>

      {/* CUERPO DEL ANEXO */}
      <Box style={{ width: "100%" }}>{renderAnnexBody()}</Box>
    </Box>
  );
};

// src/features/editor/views/ExportView.jsx
import React, { useState } from "react";
import {
  Group,
  Box,
  Button,
  Title,
  Text,
  SegmentedControl,
  Paper,
} from "@mantine/core";
import {
  IconFileTypePdf,
  IconFiles,
  IconFileText,
  IconBook,
} from "@tabler/icons-react";
import { DocumentExporter } from "../components/export/DocumentExporter";

export const ExportView = () => {
  const [isExporting, setIsExporting] = useState(false);
  // Modos: 'all' (Completo), 'body' (Solo redacción + ref), 'prelims' (Solo preliminares)
  const [exportMode, setExportMode] = useState("all");

  const handleExportPDF = () => {
    setIsExporting(true);

    // Quitamos foco de cualquier campo activo para eliminar cursores en el PDF
    if (document.activeElement) {
      document.activeElement.blur();
    }

    const fileNames = {
      all: "Documento_Completo_APA7",
      body: "Redaccion_y_Referencias_APA7",
      prelims: "Paginas_Preliminares_APA7",
    };

    const targetFileName = fileNames[exportMode] || "Documento_APA7";

    setTimeout(() => {
      if (window.electronAPI?.exportToPDF) {
        window.electronAPI.exportToPDF(targetFileName);
      } else {
        window.print();
      }
      setIsExporting(false);
    }, 400);
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden", // Impide que la ventana principal haga scroll
      }}
    >
      {/* 1. BARRA SUPERIOR FIJA (no se oculta con el scroll y no sale en impresión) */}
      <Paper
        p="md"
        radius={0}
        bg="white"
        className="no-print"
        style={{
          borderBottom: "1px solid #e9ecef",
          flexShrink: 0,
          zIndex: 100,
          boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
        }}
      >
        <Group justify="space-between" align="center" wrap="wrap" gap="md">
          <div>
            <Title order={3} size="h4">
              Exportar y Compilar
            </Title>
            <Text c="dimmed" size="xs">
              Selecciona qué secciones deseas previsualizar o guardar en PDF.
            </Text>
          </div>

          <Group gap="sm" wrap="wrap">
            {/* Selector de modo de vista/exportación */}
            <SegmentedControl
              size="xs"
              value={exportMode}
              onChange={setExportMode}
              data={[
                {
                  value: "all",
                  label: (
                    <Group gap={6} wrap="nowrap">
                      <IconFiles size={14} />
                      <span>Doc. Completo</span>
                    </Group>
                  ),
                },
                {
                  value: "body",
                  label: (
                    <Group gap={6} wrap="nowrap">
                      <IconFileText size={14} />
                      <span>Solo Redacción y Ref.</span>
                    </Group>
                  ),
                },
                {
                  value: "prelims",
                  label: (
                    <Group gap={6} wrap="nowrap">
                      <IconBook size={14} />
                      <span>Solo Preliminares</span>
                    </Group>
                  ),
                },
              ]}
            />

            <Button
              leftSection={<IconFileTypePdf size={18} />}
              color="blue"
              size="sm"
              loading={isExporting}
              onClick={handleExportPDF}
            >
              Guardar como PDF
            </Button>
          </Group>
        </Group>
      </Paper>

      {/* 2. CONTENEDOR DEL DOCUMENTO CON SCROLL INDEPENDIENTE */}
      <Box
        className="print-only-container"
        style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "var(--mantine-color-gray-1)",
        }}
      >
        {/* Pasamos exportMode a DocumentExporter para filtrar las secciones */}
        <DocumentExporter exportMode={exportMode} />
      </Box>
    </Box>
  );
};

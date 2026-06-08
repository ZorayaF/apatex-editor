import React, { useState } from "react";
import { Group, Box, Button, Stack, Title, Text, Center } from "@mantine/core";
import { IconFileTypePdf } from "@tabler/icons-react";
import { DocumentExporter } from "../components/export/DocumentExporter";

export const ExportView = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = () => {
    setIsExporting(true);

    // Damos un pequeño respiro para asegurar que React renderizó todo
    setTimeout(() => {
      if (window.electronAPI) {
        // Llama al puente de Electron (preload.js)
        window.electronAPI.exportToPDF("Mi_Documento_APA7");
      } else {
        // Fallback por si lo pruebas en el navegador web
        window.print();
      }
      setIsExporting(false);
    }, 500);
  };

  return (
    <Stack h="100%" style={{ overflowY: "auto" }} bg="gray.1">
      {/* 1. LA BARRA DE ACCIÓN (Esto no saldrá en el PDF gracias al CSS) */}
      <Box p="md" bg="white" className="no-print">
        <Group justify="space-between">
          <div>
            <Title order={3}>Exportar Documento</Title>
            <Text c="dimmed" size="sm">
              Tu documento se compilará siguiendo las normas APA 7ma Edición.
            </Text>
          </div>
          <Button
            leftSection={<IconFileTypePdf size={20} />}
            color="blue"
            loading={isExporting}
            onClick={handleExportPDF}
          >
            Guardar como PDF
          </Button>
        </Group>
      </Box>

      {/* 2. EL COMPILADOR DEL DOCUMENTO (Lo que realmente se imprime) */}
      <Center p="xl" className="print-canvas-wrapper">
        <Box
          style={{
            width: "8.5in", // Tamaño exacto Carta para simular el PDF
            backgroundColor: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          className="print-only-container"
        >
          <DocumentExporter />
        </Box>
      </Center>
    </Stack>
  );
};

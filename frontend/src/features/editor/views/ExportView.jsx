import React, { useState } from "react";
import { Group, Box, Button, Stack, Title, Text } from "@mantine/core";
import { IconFileTypePdf } from "@tabler/icons-react";
import { DocumentExporter } from "../components/export/DocumentExporter";

export const ExportView = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = () => {
    setIsExporting(true);

    // FIX: Quitamos el foco (blur) de cualquier bloque de texto activo.
    // Esto mata el cursor parpadeante y el subrayado rojo de Chrome instantáneamente.
    if (document.activeElement) {
      document.activeElement.blur();
    }

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
    // Quitamos bg="gray.1" de aquí para que DocumentExporter controle su fondo transparente
    <Stack h="100%" gap={0} style={{ overflowY: "auto" }}>
      {/* 1. LA BARRA DE ACCIÓN (Esto no saldrá en el PDF gracias al CSS) */}
      <Box
        p="md"
        bg="white"
        className="no-print"
        style={{ borderBottom: "1px solid #e9ecef", flexShrink: 0 }}
      >
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

      {/* 2. EL COMPILADOR DEL DOCUMENTO */}
      {/* Liberamos a DocumentExporter. Ya no está atrapado en un Box de 8.5in */}
      <Box className="print-only-container" style={{ flexGrow: 1 }}>
        <DocumentExporter />
      </Box>
    </Stack>
  );
};

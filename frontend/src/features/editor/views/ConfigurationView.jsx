import React, { useState } from "react";
import {
  Grid,
  Text,
  Box,
  ScrollArea,
  Stack,
  Alert,
  Center,
} from "@mantine/core";
import { useStore } from "@store";
import { IconInfoCircle } from "@tabler/icons-react";
// Componentes modulares
import { StructureSidebar } from "@config/sidebar/StructureSidebar";
import { StructurePreview } from "@config/preview/StructurePreview";
import { IdentityForm } from "@config/forms/IdentityForm";
import { AcademicForm } from "@config/forms/AcademicForm";
import { LegalForm } from "@config/forms/LegalForm";
import { OptionalForm } from "@config/forms/OptionalForm";
import { GlossaryForm } from "@config/forms/GlossaryForm";
import { AnnexesForm } from "@config/forms/AnnexesForm";
import { IntroductionForm } from "@config/forms/IntroductionForm";
import { TOCForm } from "@config/forms/TOCForm";

export const ConfigurationView = () => {
  const { projectMetadata, setProjectMetadata } = useStore();
  const [activeSection, setActiveSection] = useState("portada");

  const renderActiveForm = () => {
    switch (activeSection) {
      case "portada":
        return <IdentityForm />;
      case "resumen":
        return <AcademicForm section="resumen" />;
      case "abstract":
        return <AcademicForm section="abstract" />;
      case "dedicatoria":
        return <OptionalForm type="dedicatoria" />;
      case "agradecimientos":
        return <OptionalForm type="agradecimientos" />;
      case "glosario":
        return <GlossaryForm />;
      case "anexos":
        return <AnnexesForm />;
      case "introduccion":
        return <IntroductionForm />;

      case "referencias":
        return (
          <Stack gap="md">
            <Alert
              variant="light"
              color="blue"
              title="Información"
              icon={<IconInfoCircle />}
            >
              Las referencias bibliográficas se generan de forma automática
              según APA 7.
            </Alert>
            <Center h={200}>
              <Text c="dimmed" size="sm" ta="center">
                Usa el panel de la derecha para previsualizar tu lista de
                fuentes.
              </Text>
            </Center>
          </Stack>
        );

      case "reglamento":
        return <LegalForm />;
      case "toc":
        return <TOCForm />;

      default:
        return <Text c="dimmed">Próximamente...</Text>;
    }
  };
  const handleToggle = (path, value) => {
    setProjectMetadata(path, value);
  };

  // Definimos la altura estricta para todos los scrolls
  const alturaViewport = "calc(100vh - 60px)";

  return (
    <Grid gutter={0} m={0} style={{ overflow: "hidden" }}>
      {/* 1. NAVEGACIÓN (Izquierda) */}
      <Grid.Col span={3} style={{ borderRight: "1px solid #e9ecef" }}>
        {/* ALTURA EXACTA APLICADA DIRECTAMENTE AL SCROLLAREA */}
        <ScrollArea h={alturaViewport} offsetScrollbars type="auto">
          <Box bg="#fcfcfc" style={{ minHeight: "100%" }}>
            <StructureSidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              metadata={projectMetadata}
              onToggleSection={handleToggle}
            />
          </Box>
        </ScrollArea>
      </Grid.Col>

      {/* 2. FORMULARIOS (Centro) */}
      <Grid.Col span={5} bg="white">
        <ScrollArea h={alturaViewport} offsetScrollbars scrollbarSize={8}>
          <Box p="xl" style={{ maxWidth: 650, margin: "0 auto" }}>
            <Text
              fw={800}
              size="xs"
              c="blue"
              mb={4}
              style={{ letterSpacing: 1 }}
            >
              CONFIGURACIÓN
            </Text>
            <Text
              fw={700}
              mb="xl"
              size="xl"
              style={{ textTransform: "capitalize" }}
            >
              {activeSection}
            </Text>

            <Box pb={100}>{renderActiveForm()}</Box>
          </Box>
        </ScrollArea>
      </Grid.Col>

      {/* 3. PREVISUALIZACIÓN (Derecha) */}
      <Grid.Col
        span={4}
        bg="#f8f9fa"
        style={{ borderLeft: "1px solid #e9ecef" }}
      >
        {/* Aquí es donde la "Hoja de papel" vive. El scroll funcionará perfecto ahora. */}
        <ScrollArea h={alturaViewport} offsetScrollbars scrollbarSize={8}>
          <Box py="xl">
            <StructurePreview
              activeSection={activeSection}
              metadata={projectMetadata}
            />
          </Box>
        </ScrollArea>
      </Grid.Col>
    </Grid>
  );
};

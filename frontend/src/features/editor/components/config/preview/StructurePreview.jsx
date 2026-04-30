import React from "react";
import { Box, Text, Center, Stack, ThemeIcon, Divider } from "@mantine/core";
import { IconEyeOff } from "@tabler/icons-react";

// Importamos los componentes de hoja
import { TitlePagePreview } from "./TitlePagePreview";
import { AceptacionPagePreview } from "./AceptacionPagePreview";
import { PrelimPagePreview } from "./PrelimPagePreview";
import { GlossaryPagePreview } from "./GlossaryPagePreview";
import { TableOfContents } from "./TableOfContents";
import { BibliographyPreview } from "./BibliographyPreview";
import { SimplePagePreview } from "./SimplePagePreview";

export const StructurePreview = ({ activeSection, metadata }) => {
  const prelim = metadata?.preliminares || {};
  const projectTitle = metadata.portada?.titulo || "TÍTULO DEL PROYECTO";

  // Verificamos si la sección actual está habilitada (si es opcional)
  const isEnabled = () => {
    const alwaysEnabled = ["portada", "referencias", "aceptacion", "toc"];
    if (alwaysEnabled.includes(activeSection)) return true;
    return prelim[activeSection]?.enabled;
  };

  const renderContent = () => {
    if (!isEnabled()) {
      return (
        <Center
          h={400}
          style={{ border: "2px dashed #dee2e6", borderRadius: "8px" }}
        >
          <Stack align="center" gap="xs">
            <ThemeIcon variant="light" color="gray" size="xl" radius="xl">
              <IconEyeOff size={30} />
            </ThemeIcon>
            <Text c="dimmed" size="sm" ta="center" fw={500}>
              Esta sección está desactivada.
              <br />
              No se incluirá en el documento.
            </Text>
          </Stack>
        </Center>
      );
    }

    // Mapeo de secciones a componentes reales
    switch (activeSection) {
      case "portada":
        return (
          <Stack gap="xl">
            <Text size="xs" fw={700} ta="center">
              PORTADA (Pág. 1)
            </Text>
            {/* Pasamos la data de la portada aquí 👇 */}
            <TitlePagePreview isContraportada={false} data={metadata.portada} />

            <Divider label="Siguiente página" labelPosition="center" />

            <Text size="xs" fw={700} ta="center">
              CONTRAPORTADA (Pág. 2)
            </Text>
            {/* Y aquí también 👇 */}
            <TitlePagePreview isContraportada={true} data={metadata.portada} />
          </Stack>
        );

      case "aceptacion":
        return <AceptacionPagePreview metadata={metadata} />;

      case "resumen":
        return (
          <PrelimPagePreview
            type="resumen"
            data={prelim.resumen}
            projectTitle={projectTitle}
          />
        );

      case "abstract":
        return (
          <PrelimPagePreview
            type="abstract"
            data={prelim.abstract}
            projectTitle={projectTitle}
          />
        );

      case "referencias":
        return <BibliographyPreview />;

      case "dedicatoria":
        return (
          <SimplePagePreview type="dedicatoria" data={prelim.dedicatoria} />
        );

      case "agradecimientos":
        return (
          <SimplePagePreview
            type="agradecimientos"
            data={prelim.agradecimientos}
          />
        );

      case "glosario":
        return <GlossaryPagePreview terms={prelim.glosario?.terms} />;

      case "toc":
        return <TableOfContents />;

      case "reglamento":
        return (
          <SimplePagePreview
            type="reglamento"
            data={{
              content:
                "“Únicamente el graduando es responsable de las ideas expuestas en el presente trabajo”. (Lineamientos constitucionales, legales e institucionales que rigen la propiedad intelectual).",
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box p="md" h="100%" style={{ overflowY: "auto" }}>
      <Stack align="center" gap="xl">
        <Text size="xs" fw={800} c="dimmed" style={{ letterSpacing: "1px" }}>
          VISTA PREVIA DE IMPRESIÓN
        </Text>

        <Box
          style={{
            transform: "scale(0.45)",
            transformOrigin: "top center",
            marginBottom: "-450px",
          }}
        >
          {renderContent()}
        </Box>
      </Stack>
    </Box>
  );
};

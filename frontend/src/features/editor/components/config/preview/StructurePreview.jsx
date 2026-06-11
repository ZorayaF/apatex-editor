import React from "react";
import { Box, Text, Center, Stack, ThemeIcon, Divider } from "@mantine/core";
import { IconEyeOff } from "@tabler/icons-react";
import { APA_CONFIG, cmToPx } from "@core/utils/measurements";

// Importamos los componentes de hoja
import { TitlePagePreview } from "./TitlePagePreview";
import { AceptacionPagePreview } from "./AceptacionPagePreview";
import { PrelimPagePreview } from "./PrelimPagePreview";
import { GlossaryPagePreview } from "./GlossaryPagePreview";
import { TableOfContents } from "./TableOfContents";
import { BibliographyPreview } from "./BibliographyPreview";
import { SimplePagePreview } from "./SimplePagePreview";
import { AnnexPagePreview } from "./AnnexPagePreview";

export const StructurePreview = ({ activeSection, metadata }) => {
  const prelim = metadata?.preliminares || {};
  const projectTitle = metadata?.tituloProyecto || "TÍTULO DEL PROYECTO";
  const listaAnexos = prelim.anexos?.items || [];

  // Verificamos si la sección actual está habilitada (si es opcional)
  const isEnabled = () => {
    const alwaysEnabled = [
      "portada",
      "referencias",
      "aceptacion",
      "toc",
      "introduccion",
    ];
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

    // Mapeo de secciones a componentes reales (AHORA TODOS TIENEN METADATA)
    switch (activeSection) {
      case "portada":
        return (
          <Stack gap="xl">
            <Text size="xs" fw={700} ta="center">
              PORTADA (Pág. 1)
            </Text>
            <TitlePagePreview
              isContraportada={false}
              data={metadata}
              metadata={metadata}
            />

            <Divider label="Siguiente página" labelPosition="center" />

            <Text size="xs" fw={700} ta="center">
              CONTRAPORTADA (Pág. 2)
            </Text>
            <TitlePagePreview
              isContraportada={true}
              data={metadata}
              metadata={metadata}
            />
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
            metadata={metadata}
          />
        );

      case "abstract":
        return (
          <PrelimPagePreview
            type="abstract"
            data={prelim.abstract}
            projectTitle={projectTitle}
            metadata={metadata}
          />
        );

      case "referencias":
        return <BibliographyPreview metadata={metadata} />;

      case "introduccion":
        return (
          <SimplePagePreview
            type="introduccion"
            data={prelim.introduccion}
            metadata={metadata}
          />
        );

      case "dedicatoria":
        return (
          <SimplePagePreview
            type="dedicatoria"
            data={prelim.dedicatoria}
            metadata={metadata}
          />
        );

      case "agradecimientos":
        return (
          <SimplePagePreview
            type="agradecimientos"
            data={prelim.agradecimientos}
            metadata={metadata}
          />
        );

      case "glosario":
        return (
          <GlossaryPagePreview
            terms={prelim.glosario?.terms}
            metadata={metadata}
          />
        );

      case "toc":
        return <TableOfContents metadata={metadata} />;

      case "reglamento":
        return (
          <SimplePagePreview
            type="reglamento"
            data={{
              content:
                "“Únicamente el graduando es responsable de las ideas expuestas en el presente trabajo”. (Lineamientos constitucionales, legales e institucionales que rigen la propiedad intelectual).",
            }}
            metadata={metadata}
          />
        );

      case "anexos":
        return (
          <Stack gap="xl">
            {listaAnexos.length === 0 ? (
              <SimplePagePreview
                type="anexos"
                data={{
                  content:
                    "[Aún no has agregado ningún anexo al listado dinámico.]",
                }}
                metadata={metadata}
              />
            ) : (
              <>
                {/* 1. PÁGINA ANTECEDENTE / DIVISORIA DE ANEXOS */}
                <Box
                  style={{
                    width: `${cmToPx(APA_CONFIG.paper.width)}px`,
                    height: `${cmToPx(APA_CONFIG.paper.height)}px`,
                    backgroundColor: "white",
                    boxSizing: "border-box",
                    fontFamily: APA_CONFIG.typography.family,
                    fontSize: `${APA_CONFIG.typography.size}pt`,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* CAMBIAMOS size="24pt" POR size="12pt" */}
                  <Text size="12pt" fw="bold">
                    Anexos
                  </Text>
                </Box>

                {/* 2. MAPEADO DE LOS ANEXOS INDIVIDUALES */}
                {listaAnexos.map((anexo, index) => (
                  <React.Fragment key={anexo.id || index}>
                    <Divider
                      label={`Salto de página hacia el Anexo ${anexo.id}`}
                      labelPosition="center"
                      color="gray.4"
                    />
                    <AnnexPagePreview item={anexo} metadata={metadata} />
                  </React.Fragment>
                ))}
              </>
            )}
          </Stack>
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

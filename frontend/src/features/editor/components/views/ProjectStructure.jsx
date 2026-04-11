import React from "react";
import {
  Container,
  Grid,
  TextInput,
  Select,
  NumberInput,
  Stack,
  Title,
  Fieldset,
  TagsInput,
  SegmentedControl,
  Center,
  Group,
  Box,
} from "@mantine/core";
import { useStore } from "../../store";
import { TitlePagePreview } from "../project/TitlePagePreview";

export const ProjectStructure = () => {
  const { projectMetadata, setProjectMetadata } = useStore();
  const [view, setView] = React.useState("formulario");

  return (
    <Container size="md" py="xl">
      {/* --- ENCABEZADO CON CONTROL DE VISTA --- */}
      <Group justify="space-between" mb="xl">
        <Title order={2}>Estructura del Proyecto</Title>
        <SegmentedControl
          value={view}
          onChange={setView}
          data={[
            { label: "Editar Datos", value: "formulario" },
            { label: "Ver Portada", value: "portada" },
            { label: "Ver Contraportada", value: "contra" },
          ]}
        />
      </Group>

      {/* --- RENDERIZADO CONDICIONAL --- */}
      {view === "formulario" ? (
        <Grid gutter="xl">
          {/* COLUMNA IZQUIERDA: IDENTIDAD */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="md">
              <Fieldset legend="Identidad del Proyecto">
                <TextInput
                  label="Título del Proyecto"
                  description="Se renderizará en mayúsculas según norma"
                  placeholder="Ej: SISTEMA DE GESTIÓN DE..."
                  value={projectMetadata.tituloProyecto}
                  onChange={(e) =>
                    setProjectMetadata("tituloProyecto", e.target.value)
                  }
                />

                <TagsInput
                  label="Autores"
                  description="Presiona Enter para añadir cada autor"
                  placeholder="Añadir autor..."
                  value={projectMetadata.autores}
                  onChange={(val) => setProjectMetadata("autores", val)}
                  mt="sm"
                />

                <Grid mt="sm">
                  <Grid.Col span={6}>
                    <Select
                      label="Tipo de Trabajo"
                      data={["Monografía", "Ensayo", "Semillero", "Tesis"]}
                      value={projectMetadata.tipoTrabajo}
                      onChange={(val) => setProjectMetadata("tipoTrabajo", val)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Grado Objetivo"
                      placeholder="Ej: Ingeniero de Sistemas"
                      value={projectMetadata.gradoObjetivo}
                      onChange={(e) =>
                        setProjectMetadata("gradoObjetivo", e.target.value)
                      }
                    />
                  </Grid.Col>
                </Grid>
              </Fieldset>

              <Fieldset legend="Asesoría">
                <Grid>
                  <Grid.Col span={8}>
                    <TextInput
                      label="Nombre del Director"
                      value={projectMetadata.director.nombre}
                      onChange={(e) =>
                        setProjectMetadata("director.nombre", e.target.value)
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="Título"
                      placeholder="Ej: MSc. Ing."
                      value={projectMetadata.director.titulo}
                      onChange={(e) =>
                        setProjectMetadata("director.titulo", e.target.value)
                      }
                    />
                  </Grid.Col>
                </Grid>
              </Fieldset>
            </Stack>
          </Grid.Col>

          {/* COLUMNA DERECHA: INSTITUCIONAL */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack gap="md">
              <Fieldset legend="Datos Institucionales">
                <TextInput
                  label="Institución"
                  value={projectMetadata.institucion}
                  disabled
                  variant="filled"
                />

                <Select
                  label="Facultad"
                  mt="sm"
                  data={[
                    "Ciencias e Ingeniería",
                    "Ciencias de la Salud",
                    "Ciencias Jurídicas y Sociales",
                  ]}
                  value={projectMetadata.facultad}
                  onChange={(val) => setProjectMetadata("facultad", val)}
                />

                <TextInput
                  label="Programa"
                  mt="sm"
                  value={projectMetadata.programa}
                  onChange={(e) =>
                    setProjectMetadata("programa", e.target.value)
                  }
                />

                <Grid mt="sm">
                  <Grid.Col span={7}>
                    <Select
                      label="Ubicación"
                      data={["Tunja", "Sogamoso", "Chiquinquirá"]}
                      value={projectMetadata.ubicacion}
                      onChange={(val) => setProjectMetadata("ubicacion", val)}
                    />
                  </Grid.Col>
                  <Grid.Col span={5}>
                    <NumberInput
                      label="Año"
                      hideControls
                      value={projectMetadata.anio}
                      onChange={(val) =>
                        setProjectMetadata(
                          "anio",
                          val || new Date().getFullYear(),
                        )
                      }
                    />
                  </Grid.Col>
                </Grid>
              </Fieldset>
            </Stack>
          </Grid.Col>
        </Grid>
      ) : (
        /* --- VISTA DE PREVISUALIZACIÓN (PORTADA O CONTRAPORTADA) --- */
        <Center
          bg="gray.1"
          py="xl"
          style={{
            borderRadius: "8px",
            border: "1px solid #dee2e6",
            minHeight: "80vh",
          }}
        >
          <TitlePagePreview isContraportada={view === "contra"} />
        </Center>
      )}
    </Container>
  );
};

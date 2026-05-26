// src/features/editor/components/config/forms/IdentityForm/IdentityForm.jsx
import {
  Stack,
  TextInput,
  Select,
  Grid,
  NumberInput,
  TagsInput,
  Fieldset,
  Divider,
  Text,
} from "@mantine/core";
import { useStore } from "@store";

// Diccionario de facultades y programas institucionales (Uniboyacá)
const ESTRUCTURA_UNIBOYACA = {
  "Facultad de Ciencias de la Salud": [
    "Medicina",
    "Enfermería",
    "Fisioterapia",
    "Bacteriología y Laboratorio Clínico",
    "Terapia Respiratoria",
    "Psicología",
  ],
  "Facultad de Ingeniería, Arquitectura y Diseño": [
    "Ingeniería Civil",
    "Ingeniería Mecatrónica",
    "Ingeniería de Sistemas",
    "Ingeniería en Multimedia",
    "Ingeniería Ambiental",
    "Ingeniería Industrial",
    "Arquitectura",
    "Diseño Gráfico",
  ],
  "Facultad de Ciencias Jurídicas y Sociales": [
    "Derecho y Ciencias Políticas",
    "Comunicación Social",
    "Licenciatura en Educación Infantil",
  ],
  "Facultad de Ciencias Administrativas y Contables": [
    "Administración de Negocios Internacionales",
    "Contaduría Pública",
    "Administración de Empresas",
  ],
};

export const IdentityForm = () => {
  const { projectMetadata, setProjectMetadata } = useStore();

  // Extraemos dinámicamente las facultades del diccionario
  const facultades = Object.keys(ESTRUCTURA_UNIBOYACA);

  // Filtramos los programas según la facultad activa en el Store de forma segura
  const programasDisponibles = projectMetadata?.facultad
    ? ESTRUCTURA_UNIBOYACA[projectMetadata.facultad] || []
    : [];

  return (
    <Stack gap="xl">
      {/* 1. INFORMACIÓN GENERAL DEL PROYECTO ACADÉMICO */}
      <Fieldset
        legend={<Text fw={700}>Información del Proyecto</Text>}
        variant="unstyled"
      >
        <Stack gap="md">
          <TextInput
            label="Título del Proyecto"
            placeholder="Escriba el título completo..."
            value={projectMetadata?.portada?.titulo || ""}
            onChange={(e) =>
              setProjectMetadata("portada.titulo", e.target.value)
            }
          />

          <TagsInput
            label="Autores"
            placeholder="Añadir autor"
            description="Presiona Enter para agregar cada nombre"
            value={projectMetadata?.autores || []}
            onChange={(val) => setProjectMetadata("autores", val)}
          />

          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Tipo de Trabajo"
                data={["Monografía", "Tesis de Grado", "Trabajo de Grado"]}
                value={projectMetadata?.tipoTrabajo || ""}
                onChange={(val) => setProjectMetadata("tipoTrabajo", val)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Título a Obtener"
                placeholder="Selecciona o escribe el grado..."
                data={[
                  "Ingeniero de Sistemas",
                  "Ingeniero Civil",
                  "Arquitecto",
                  "Diseñador Gráfico",
                  "Psicólogo",
                  "Abogado",
                ]}
                searchable
                creatable
                getCreateLabel={(query) => `+ Añadir "${query}"`}
                onCreate={(query) => {
                  setProjectMetadata("gradoObjetivo", query);
                  return query;
                }}
                value={projectMetadata?.gradoObjetivo || ""}
                onChange={(val) => setProjectMetadata("gradoObjetivo", val)}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Fieldset>

      <Divider label="Dirección de Tesis" labelPosition="center" />

      {/* 2. DATOS DE DIRECCIÓN / ASESORÍA */}
      <Fieldset variant="unstyled">
        <Grid align="flex-end">
          <Grid.Col span={8}>
            <TextInput
              label="Nombre del Director"
              placeholder="Nombre del docente tutor..."
              value={projectMetadata?.director?.nombre || ""}
              onChange={(e) =>
                setProjectMetadata("director.nombre", e.target.value)
              }
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Grado (Ej: Mg, PhD)"
              placeholder="Título máximo"
              value={projectMetadata?.director?.titulo || ""}
              onChange={(e) =>
                setProjectMetadata("director.titulo", e.target.value)
              }
            />
          </Grid.Col>
        </Grid>
      </Fieldset>

      <Divider label="Datos Institucionales" labelPosition="center" />

      {/* 3. ESTRUCTURA ACADÉMICA VINCULADA */}
      <Fieldset variant="unstyled">
        <Stack gap="md">
          <TextInput
            label="Institución"
            value={projectMetadata?.institucion || "Universidad de Boyacá"}
            onChange={(e) => setProjectMetadata("institucion", e.target.value)}
          />

          {/* SELECTOR DE FACULTAD */}
          <Select
            label="Facultad"
            placeholder="Seleccione la facultad"
            data={facultades}
            searchable
            value={projectMetadata?.facultad || null}
            onChange={(val) => {
              setProjectMetadata("facultad", val);
              // Resetear programa de forma reactiva si muta la facultad de origen
              setProjectMetadata("programa", "");
            }}
          />

          {/* SELECTOR DE PROGRAMA DEPENDIENTE */}
          <Select
            label="Programa"
            placeholder={
              projectMetadata?.facultad
                ? "Seleccione el programa"
                : "Seleccione primero una facultad"
            }
            data={programasDisponibles}
            searchable
            disabled={!projectMetadata?.facultad}
            value={projectMetadata?.programa || null}
            onChange={(val) => setProjectMetadata("programa", val)}
          />

          <Grid>
            <Grid.Col span={8}>
              <TextInput
                label="Ubicación"
                placeholder="Ciudad, Departamento"
                value={projectMetadata?.ubicacion || "Tunja, Boyacá"}
                onChange={(e) =>
                  setProjectMetadata("ubicacion", e.target.value)
                }
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Año"
                hideControls
                value={projectMetadata?.anio || 2026}
                onChange={(val) => setProjectMetadata("anio", val)}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Fieldset>
    </Stack>
  );
};

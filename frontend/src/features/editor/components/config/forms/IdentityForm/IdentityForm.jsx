import { useState, useEffect } from "react";
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
import { Autocomplete } from "@mantine/core";

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

  const facultades = Object.keys(ESTRUCTURA_UNIBOYACA);
  const programasDisponibles = projectMetadata?.facultad
    ? ESTRUCTURA_UNIBOYACA[projectMetadata.facultad] || []
    : [];

  // --- 1. ESTADO LOCAL (Súper rápido, 0 lag) ---
  const [localTitle, setLocalTitle] = useState(
    projectMetadata?.tituloProyecto || "",
  );
  const [localShortTitle, setLocalShortTitle] = useState(
    projectMetadata?.tituloAbreviado || "",
  );

  // --- 2. SINCRONIZACIÓN SILENCIOSA (Debounce) ---
  // Espera a que el usuario deje de teclear por 500ms antes de avisarle a Zustand
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localTitle !== projectMetadata?.tituloProyecto) {
        setProjectMetadata("tituloProyecto", localTitle);
      }
      if (localShortTitle !== projectMetadata?.tituloAbreviado) {
        setProjectMetadata("tituloAbreviado", localShortTitle);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localTitle, localShortTitle, projectMetadata, setProjectMetadata]);

  // --- 3. MANEJADORES LOCALES ---
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;

    // Actualizamos la UI al instante
    setLocalTitle(newTitle);

    // Auto-generamos el corto localmente
    const autoRunningHead = newTitle.substring(0, 50).toUpperCase();
    setLocalShortTitle(autoRunningHead);
  };

  const handleShortTitleChange = (e) => {
    setLocalShortTitle(e.target.value.toUpperCase());
  };

  // Forzar guardado si el usuario hace clic fuera del input (OnBlur)
  const handleBlur = () => {
    if (localTitle !== projectMetadata?.tituloProyecto)
      setProjectMetadata("tituloProyecto", localTitle);
    if (localShortTitle !== projectMetadata?.tituloAbreviado)
      setProjectMetadata("tituloAbreviado", localShortTitle);
  };

  return (
    <Stack gap="xl">
      <Fieldset
        legend={<Text fw={700}>Información del Proyecto</Text>}
        variant="unstyled"
      >
        <Stack gap="md">
          {/* TÍTULO COMPLETO CONECTADO AL ESTADO LOCAL */}
          <TextInput
            label="Título del Proyecto"
            placeholder="Escriba el título completo..."
            value={localTitle}
            onChange={handleTitleChange}
            onBlur={handleBlur}
          />

          {/* TÍTULO ABREVIADO CONECTADO AL ESTADO LOCAL */}
          <TextInput
            label="Título Abreviado (Running Head)"
            description="Aparecerá en el encabezado de las páginas. Máximo 50 caracteres."
            placeholder="TÍTULO ABREVIADO..."
            maxLength={50}
            styles={{ input: { textTransform: "uppercase" } }}
            value={localShortTitle}
            onChange={handleShortTitleChange}
            onBlur={handleBlur}
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
              <Autocomplete
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
                value={projectMetadata?.gradoObjetivo || ""}
                onChange={(val) => setProjectMetadata("gradoObjetivo", val)}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Fieldset>

      <Divider label="Dirección de Tesis" labelPosition="center" />

      <Fieldset variant="unstyled">
        {/* BLOQUE DEL DIRECTOR */}
        <Grid align="flex-end">
          <Grid.Col span={4}>
            <Select
              label="Cargo"
              data={["Director", "Directora"]}
              value={projectMetadata?.director?.rol || "Director"}
              onChange={(value) => setProjectMetadata("director.rol", value)}
              allowDeselect={false}
            />
          </Grid.Col>
          <Grid.Col span={5}>
            <TextInput
              label="Nombre completo"
              placeholder="Nombre del docente..."
              value={projectMetadata?.director?.nombre || ""}
              onChange={(e) =>
                setProjectMetadata("director.nombre", e.target.value)
              }
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="Grado"
              placeholder="Ej: Ph.D."
              value={projectMetadata?.director?.titulo || ""}
              onChange={(e) =>
                setProjectMetadata("director.titulo", e.target.value)
              }
            />
          </Grid.Col>
        </Grid>

        {/* BLOQUE DEL CODIRECTOR (OPCIONAL) */}
        <Grid align="flex-end" mt="xl">
          <Grid.Col span={4}>
            <Select
              label="Cargo (Opcional)"
              data={["Codirector", "Codirectora"]}
              value={projectMetadata?.codirector?.rol || "Codirector"}
              onChange={(value) => setProjectMetadata("codirector.rol", value)}
              allowDeselect={false}
            />
          </Grid.Col>
          <Grid.Col span={5}>
            <TextInput
              label="Nombre completo"
              placeholder="Si aplica..."
              value={projectMetadata?.codirector?.nombre || ""}
              onChange={(e) =>
                setProjectMetadata("codirector.nombre", e.target.value)
              }
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="Grado"
              placeholder="Ej: Ph.D."
              value={projectMetadata?.codirector?.titulo || ""}
              onChange={(e) =>
                setProjectMetadata("codirector.titulo", e.target.value)
              }
            />
          </Grid.Col>
        </Grid>
      </Fieldset>

      <Divider label="Datos Institucionales" labelPosition="center" />

      <Fieldset variant="unstyled">
        <Stack gap="md">
          <TextInput
            label="Institución"
            value={projectMetadata?.institucion || "Universidad de Boyacá"}
            onChange={(e) => setProjectMetadata("institucion", e.target.value)}
          />

          <Select
            label="Facultad"
            placeholder="Seleccione la facultad"
            data={facultades}
            searchable
            value={projectMetadata?.facultad || null}
            onChange={(val) => {
              setProjectMetadata("facultad", val);
              setProjectMetadata("programa", "");
            }}
          />

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

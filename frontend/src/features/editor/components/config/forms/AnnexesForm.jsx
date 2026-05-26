// src/features/editor/components/config/forms/AnnexesForm.jsx
import React, { useState } from "react";
import {
  Stack,
  TextInput,
  Textarea,
  Button,
  ActionIcon,
  Group,
  Paper,
  Text,
  Divider,
  Box,
  Select,
  Checkbox,
} from "@mantine/core";
import {
  IconPlus,
  IconTrash,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react";
import { useStore } from "@store";

export const AnnexesForm = () => {
  const { projectMetadata, setProjectMetadata } = useStore();
  const annexes = projectMetadata.preliminares.anexos?.items || [];

  // Estado local para controlar el formulario de nuevo anexo
  const [newAnnex, setNewAnnex] = useState({
    title: "",
    description: "",
    type: "text",
    contentText: "",
    contentImage: { fileUrl: "", hasSource: false, sourceText: "" },
    contentLinks: [], // Array de objetos { label: "", url: "" }
  });

  // Estado local para agregar links individuales a la lista temporal
  const [tempLink, setTempLink] = useState({ label: "", url: "" });

  // Función para convertir el índice numérico en letras (0 -> A, 1 -> B, 26 -> AA)
  const generateLetterId = (index) => {
    let label = "";
    let temp = index;
    while (temp >= 0) {
      label = String.fromCharCode((temp % 26) + 65) + label;
      temp = Math.floor(temp / 26) - 1;
    }
    return label;
  };

  const updateAnnexesStore = (newList) => {
    // Re-calculamos los IDs alfabéticos de todos los anexos según su posición actual
    const updatedList = newList.map((item, idx) => ({
      ...item,
      id: generateLetterId(idx),
    }));
    setProjectMetadata("preliminares.anexos.items", updatedList);
  };

  const addAnnex = () => {
    if (!newAnnex.title) return; // El título es obligatorio

    updateAnnexesStore([...annexes, newAnnex]);

    // Resetear el estado
    setNewAnnex({
      title: "",
      description: "",
      type: "text",
      contentText: "",
      contentImage: { fileUrl: "", hasSource: false, sourceText: "" },
      contentLinks: [],
    });
    setTempLink({ label: "", url: "" });
  };

  const removeAnnex = (index) => {
    updateAnnexesStore(annexes.filter((_, i) => i !== index));
  };

  // Funciones para reordenar los anexos (esencial si cambian el orden en el texto)
  const moveAnnex = (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= annexes.length) return;

    const updated = [...annexes];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    updateAnnexesStore(updated);
  };

  const addLinkToTempList = () => {
    if (!tempLink.url) return;
    setNewAnnex({
      ...newAnnex,
      contentLinks: [...newAnnex.contentLinks, tempLink],
    });
    setTempLink({ label: "", url: "" });
  };

  return (
    <Stack gap="xl">
      <Paper withBorder p="md" bg="gray.0" radius="md">
        <Text fw={700} size="sm" mb="md">
          Añadir Nuevo Anexo (Siguiente Letra:{" "}
          {generateLetterId(annexes.length)})
        </Text>

        <Stack gap="sm">
          <TextInput
            label="Título del Anexo"
            placeholder="Ej: Resultado proceso de investigación"
            required
            value={newAnnex.title}
            onChange={(e) =>
              setNewAnnex({ ...newAnnex, title: e.target.value })
            }
          />

          <Textarea
            label="Descripción o Introducción (Opcional)"
            placeholder="En la siguiente tabla se presentan los anexos pertinentes..."
            autosize
            minRows={2}
            value={newAnnex.description}
            onChange={(e) =>
              setNewAnnex({ ...newAnnex, description: e.target.value })
            }
          />

          <Select
            label="Tipo de Contenido"
            data={[
              { value: "text", label: "Texto Plano / Redacción" },
              { value: "links", label: "Lista de Enlaces (Links)" },
              { value: "image", label: "Ilustración / Imagen / Infografía" },
              { value: "table", label: "Tabla de Datos (Muestra)" },
            ]}
            value={newAnnex.type}
            onChange={(val) =>
              setNewAnnex({ ...newAnnex, type: val || "text" })
            }
          />

          {/* RENDERIZADO CONDICIONAL SEGÚN EL TIPO SELECCIONADO */}
          {newAnnex.type === "text" && (
            <Textarea
              label="Cuerpo del Texto"
              placeholder="Escribe o pega el contenido textual aquí..."
              minRows={4}
              autosize
              value={newAnnex.contentText}
              onChange={(e) =>
                setNewAnnex({ ...newAnnex, contentText: e.target.value })
              }
            />
          )}

          {newAnnex.type === "image" && (
            <Stack gap="xs">
              <TextInput
                label="URL de la Imagen"
                placeholder="Inserta el enlace directo de tu imagen (JPG, PNG)..."
                value={newAnnex.contentImage.fileUrl}
                onChange={(e) =>
                  setNewAnnex({
                    ...newAnnex,
                    contentImage: {
                      ...newAnnex.contentImage,
                      fileUrl: e.target.value,
                    },
                  })
                }
              />
              <Checkbox
                label="¿Este elemento fue tomado de otra fuente? (No es autoría propia)"
                checked={newAnnex.contentImage.hasSource}
                onChange={(e) =>
                  setNewAnnex({
                    ...newAnnex,
                    contentImage: {
                      ...newAnnex.contentImage,
                      hasSource: e.currentTarget.checked,
                    },
                  })
                }
              />
              {newAnnex.contentImage.hasSource && (
                <TextInput
                  label="Fuente Bibliográfica"
                  placeholder="Ej: Ministerio de Salud (2024)"
                  value={newAnnex.contentImage.sourceText}
                  onChange={(e) =>
                    setNewAnnex({
                      ...newAnnex,
                      contentImage: {
                        ...newAnnex.contentImage,
                        sourceText: e.target.value,
                      },
                    })
                  }
                />
              )}
            </Stack>
          )}

          {newAnnex.type === "links" && (
            <Paper withBorder p="xs" bg="white">
              <Text size="xs" fw={700} mb="xs">
                Construir Lista de Enlaces:
              </Text>
              <Group align="flex-end" mb="xs">
                <TextInput
                  label="Nombre del Enlace"
                  placeholder="Ej: Entrevista A"
                  style={{ flex: 1 }}
                  value={tempLink.label}
                  onChange={(e) =>
                    setTempLink({ ...tempLink, label: e.target.value })
                  }
                />
                <TextInput
                  label="URL"
                  placeholder="https://..."
                  style={{ flex: 1 }}
                  value={tempLink.url}
                  onChange={(e) =>
                    setTempLink({ ...tempLink, url: e.target.value })
                  }
                />
                <Button variant="light" onClick={addLinkToTempList}>
                  Agregar Link
                </Button>
              </Group>

              {/* Visualización temporal de links en cola */}
              {newAnnex.contentLinks.map((l, i) => (
                <Text key={i} size="xs" c="blue.7" fw={600}>
                  • {l.label || l.url} ({l.url})
                </Text>
              ))}
            </Paper>
          )}

          {newAnnex.type === "table" && (
            <Paper
              p="xs"
              withBorder
              bg="yellow.0"
              style={{ borderStyle: "dashed" }}
            >
              <Text size="xs" c="yellow.9" fw={600}>
                Nota: La estructura de la tabla se genera bajo el estándar
                estructural de muestras universitarias. Podrás poblar sus filas
                desde las celdas del bloque editor principal.
              </Text>
            </Paper>
          )}

          <Button
            leftSection={<IconPlus size={16} />}
            onClick={addAnnex}
            fullWidth
            mt="md"
            color="blue"
          >
            Añadir a la Lista de Anexos
          </Button>
        </Stack>
      </Paper>

      <Divider
        label={`Anexos creados en el documento (${annexes.length})`}
        labelPosition="center"
      />

      {/* LISTADO DE ANEXOS AGREGADOS CON CONTROL DE ORDEN */}
      <Stack gap="sm">
        {annexes.map((item, index) => (
          <Paper key={item.id || index} withBorder p="sm" shadow="xs">
            <Group align="center" justify="space-between" wrap="nowrap">
              <Box style={{ flex: 1 }}>
                <Text fw={700} c="blue.8" size="sm">
                  Anexo {item.id}. {item.title}
                </Text>
                <Text
                  size="xs"
                  c="dimmed"
                  style={{ textTransform: "capitalize" }}
                >
                  Tipo: {item.type}{" "}
                  {item.description
                    ? `| ${item.description.substring(0, 40)}...`
                    : ""}
                </Text>
              </Box>

              <Group gap={4}>
                {/* Botones de ordenamiento secuencial */}
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  disabled={index === 0}
                  onClick={() => moveAnnex(index, "up")}
                >
                  <IconArrowUp size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  disabled={index === annexes.length - 1}
                  onClick={() => moveAnnex(index, "down")}
                >
                  <IconArrowDown size={16} />
                </ActionIcon>

                {/* Botón de eliminación */}
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => removeAnnex(index)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
};

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
  FileButton,
  Table,
} from "@mantine/core";
import {
  IconPlus,
  IconTrash,
  IconArrowUp,
  IconArrowDown,
  IconUpload,
  IconMinus,
} from "@tabler/icons-react";
import { useStore } from "@store";

export const AnnexesForm = () => {
  const { projectMetadata, setProjectMetadata } = useStore();
  const annexes = projectMetadata.preliminares.anexos?.items || [];

  // Estado base del anexo inicializado con la estructura exacta que necesitan tus sub-formularios
  const [newAnnex, setNewAnnex] = useState({
    title: "",
    description: "",
    type: "text",
    contentText: "",
    // Simula las propiedades nativas de tu FigureBlock
    contentImage: { fileUrl: "", isLocal: false, width: 100 },
    // Simula la matriz bidimensional que espera tu TableBlock (ej: 2 filas x 3 columnas iniciales)
    contentTable: [
      ["Criterio", "Frecuencia", "Porcentaje"],
      ["", "", ""],
    ],
    contentLinks: [],
  });

  const [tempLink, setTempLink] = useState({ label: "", url: "" });

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
    const updatedList = newList.map((item, idx) => ({
      ...item,
      id: generateLetterId(idx),
    }));
    setProjectMetadata("preliminares.anexos.items", updatedList);
  };

  const addAnnex = () => {
    if (!newAnnex.title) return;
    updateAnnexesStore([...annexes, newAnnex]);

    setNewAnnex({
      title: "",
      description: "",
      type: "text",
      contentText: "",
      contentImage: { fileUrl: "", isLocal: false, width: 100 },
      contentTable: [
        ["Criterio", "Frecuencia", "Porcentaje"],
        ["", "", ""],
      ],
      contentLinks: [],
    });
    setTempLink({ label: "", url: "" });
  };

  const removeAnnex = (index) => {
    updateAnnexesStore(annexes.filter((_, i) => i !== index));
  };

  const moveAnnex = (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= annexes.length) return;
    const updated = [...annexes];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    updateAnnexesStore(updated);
  };

  // --- REUTILIZACIÓN DE LA LÓGICA DE CARGA DE FIGURAS ---
  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewAnnex({
        ...newAnnex,
        contentImage: {
          ...newAnnex.contentImage,
          fileUrl: e.target.result,
          isLocal: true,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  // --- REUTILIZACIÓN DE LA LÓGICA ESTRUCTURAL DE TABLAS ---
  const addRow = () => {
    const newRow = new Array(newAnnex.contentTable[0].length).fill("");
    setNewAnnex({
      ...newAnnex,
      contentTable: [...newAnnex.contentTable, newRow],
    });
  };

  const removeRow = () => {
    if (newAnnex.contentTable.length <= 1) return;
    setNewAnnex({
      ...newAnnex,
      contentTable: newAnnex.contentTable.slice(0, -1),
    });
  };

  const addColumn = () => {
    const newData = newAnnex.contentTable.map((row) => [...row, ""]);
    setNewAnnex({ ...newAnnex, contentTable: newData });
  };

  const removeColumn = () => {
    if (newAnnex.contentTable[0].length <= 1) return;
    const newData = newAnnex.contentTable.map((row) => row.slice(0, -1));
    setNewAnnex({ ...newAnnex, contentTable: newData });
  };

  const handleCellChange = (rowIndex, colIndex, val) => {
    const updatedTable = newAnnex.contentTable.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? val : cell,
      ),
    );
    setNewAnnex({ ...newAnnex, contentTable: updatedTable });
  };

  return (
    <Stack gap="xl">
      <Paper withBorder p="md" bg="gray.0" radius="md">
        <Text fw={700} size="sm" mb="md">
          Añadir Nuevo Anexo ({generateLetterId(annexes.length)})
        </Text>

        <Stack gap="sm">
          <TextInput
            label="Título del Anexo"
            placeholder="Ej: Matriz de variables o Infografía técnica"
            required
            value={newAnnex.title}
            onChange={(e) =>
              setNewAnnex({ ...newAnnex, title: e.target.value })
            }
          />

          <Textarea
            label="Descripción / Nota APA (Opcional)"
            placeholder="Nota: Tomado de..."
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
              { value: "table", label: "Tabla de Datos Dinámica" },
            ]}
            value={newAnnex.type}
            onChange={(val) =>
              setNewAnnex({ ...newAnnex, type: val || "text" })
            }
          />

          {/* 🖼️ INTERFAZ REUTILIZADA: DISEÑO DE ORIGEN DE FIGURA */}
          {newAnnex.type === "image" && (
            <Stack gap="xs">
              {!newAnnex.contentImage.isLocal ? (
                <FileButton onChange={handleImageUpload} accept="image/*">
                  {(props) => (
                    <Button
                      {...props}
                      variant="light"
                      leftSection={<IconUpload size={16} />}
                    >
                      Subir imagen desde el equipo
                    </Button>
                  )}
                </FileButton>
              ) : (
                <Button
                  variant="outline"
                  color="red"
                  leftSection={<IconTrash size={16} />}
                  onClick={() =>
                    setNewAnnex({
                      ...newAnnex,
                      contentImage: { fileUrl: "", isLocal: false, width: 100 },
                    })
                  }
                >
                  Quitar archivo local
                </Button>
              )}

              <Divider label="o enlace externo" labelPosition="center" />

              <TextInput
                label="URL Externa"
                placeholder="https://..."
                disabled={newAnnex.contentImage.isLocal}
                value={
                  newAnnex.contentImage.isLocal
                    ? "Archivo local cargado"
                    : newAnnex.contentImage.fileUrl
                }
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
            </Stack>
          )}

          {/* 📊 INTERFAZ REUTILIZADA: GESTIÓN DE MATRIZ DE TABLAS */}
          {newAnnex.type === "table" && (
            <Stack gap="md">
              <Group grow>
                <Group gap={5}>
                  <Text size="xs" fw={500} c="dimmed" w="100%">
                    Filas
                  </Text>
                  <ActionIcon variant="light" color="red" onClick={removeRow}>
                    <IconMinus size={14} />
                  </ActionIcon>
                  <Text size="sm" fw={700} ta="center" w={20}>
                    {newAnnex.contentTable.length}
                  </Text>
                  <ActionIcon variant="light" color="blue" onClick={addRow}>
                    <IconPlus size={14} />
                  </ActionIcon>
                </Group>

                <Group gap={5}>
                  <Text size="xs" fw={500} c="dimmed" w="100%">
                    Columnas
                  </Text>
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={removeColumn}
                  >
                    <IconMinus size={14} />
                  </ActionIcon>
                  <Text size="sm" fw={700} ta="center" w={20}>
                    {newAnnex.contentTable[0].length}
                  </Text>
                  <ActionIcon variant="light" color="blue" onClick={addColumn}>
                    <IconPlus size={14} />
                  </ActionIcon>
                </Group>
              </Group>

              {/* Pequeña matriz editable interactiva dentro del formulario */}
              <Box style={{ overflowX: "auto" }}>
                <Table
                  variant="unstyled"
                  style={{ border: "1px solid #dee2e6" }}
                >
                  <Table.Tbody>
                    {newAnnex.contentTable.map((row, rIdx) => (
                      <Table.Tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <Table.Td key={cIdx} p={2}>
                            <TextInput
                              size="xs"
                              variant="unstyled"
                              style={{
                                border: "1px solid #e0e0e0",
                                padding: "2px",
                                backgroundColor:
                                  rIdx === 0 ? "#f8f9fa" : "white",
                                fontWeight: rIdx === 0 ? "bold" : "normal",
                              }}
                              value={cell}
                              onChange={(e) =>
                                handleCellChange(rIdx, cIdx, e.target.value)
                              }
                            />
                          </Table.Td>
                        ))}
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Box>
            </Stack>
          )}

          {/* 🔗 INTERFAZ: ENLACES */}
          {newAnnex.type === "links" && (
            <Paper withBorder p="xs" bg="white">
              <Group align="flex-end" mb="xs">
                <TextInput
                  label="Nombre"
                  placeholder="Entrevista A"
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
                <Button
                  variant="light"
                  onClick={() =>
                    (tempLink.url &&
                      setNewAnnex({
                        ...newAnnex,
                        contentLinks: [...newAnnex.contentLinks, tempLink],
                      })) ||
                    setTempLink({ label: "", url: "" })
                  }
                >
                  Añadir
                </Button>
              </Group>
              {newAnnex.contentLinks.map((l, i) => (
                <Text key={i} size="xs" c="blue.7" fw={600}>
                  • {l.label || l.url}
                </Text>
              ))}
            </Paper>
          )}

          {/* 🔤 INTERFAZ: TEXTO */}
          {newAnnex.type === "text" && (
            <Textarea
              label="Cuerpo del Texto"
              placeholder="Redacte el anexo..."
              minRows={4}
              value={newAnnex.contentText}
              onChange={(e) =>
                setNewAnnex({ ...newAnnex, contentText: e.target.value })
              }
            />
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

      {/* Listado inferior con botones de orden (idéntico al anterior) */}
      <Stack gap="sm">
        {annexes.map((item, index) => (
          <Paper key={item.id || index} withBorder p="sm" shadow="xs">
            <Group align="center" justify="space-between">
              <Box>
                <Text fw={700} c="blue.8" size="sm">
                  Anexo {item.id}. {item.title}
                </Text>
                <Text
                  size="xs"
                  c="dimmed"
                  style={{ textTransform: "uppercase" }}
                >
                  Tipo: {item.type}
                </Text>
              </Box>
              <Group gap={4}>
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

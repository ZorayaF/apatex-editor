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
  IconPencil,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useStore } from "@store";

const INITIAL_ANNEX_STATE = {
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
};

export const AnnexesForm = () => {
  const { projectMetadata, setProjectMetadata } = useStore();
  const annexes = projectMetadata?.preliminares?.anexos?.items || [];

  // Índice del anexo en edición (null = modo creación)
  const [editingIndex, setEditingIndex] = useState(null);

  // Estado del formulario
  const [currentAnnex, setCurrentAnnex] = useState(INITIAL_ANNEX_STATE);
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

  const resetForm = () => {
    setEditingIndex(null);
    setCurrentAnnex(INITIAL_ANNEX_STATE);
    setTempLink({ label: "", url: "" });
  };

  // Guardar (Crear o Actualizar)
  const handleSaveAnnex = () => {
    if (!currentAnnex.title.trim()) return;

    if (editingIndex !== null) {
      // Actualizar existente
      const updated = [...annexes];
      updated[editingIndex] = { ...currentAnnex };
      updateAnnexesStore(updated);
    } else {
      // Agregar nuevo
      updateAnnexesStore([...annexes, currentAnnex]);
    }

    resetForm();
  };

  // Iniciar edición
  const handleStartEdit = (index) => {
    const itemToEdit = annexes[index];
    setEditingIndex(index);
    setCurrentAnnex({
      title: itemToEdit.title || "",
      description: itemToEdit.description || "",
      type: itemToEdit.type || "text",
      contentText: itemToEdit.contentText || "",
      contentImage: itemToEdit.contentImage || {
        fileUrl: "",
        isLocal: false,
        width: 100,
      },
      contentTable:
        itemToEdit.contentTable && itemToEdit.contentTable.length > 0
          ? itemToEdit.contentTable
          : [
              ["Criterio", "Frecuencia", "Porcentaje"],
              ["", "", ""],
            ],
      contentLinks: itemToEdit.contentLinks || [],
    });
  };

  const removeAnnex = (index) => {
    if (editingIndex === index) {
      resetForm();
    } else if (editingIndex !== null && index < editingIndex) {
      setEditingIndex(editingIndex - 1);
    }
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

    // Ajustar índice de edición si se movió el elemento activo
    if (editingIndex === index) {
      setEditingIndex(targetIndex);
    } else if (editingIndex === targetIndex) {
      setEditingIndex(index);
    }
  };

  // --- IMÁGENES ---
  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentAnnex({
        ...currentAnnex,
        contentImage: {
          ...currentAnnex.contentImage,
          fileUrl: e.target.result,
          isLocal: true,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  // --- TABLAS ---
  const addRow = () => {
    const newRow = new Array(currentAnnex.contentTable[0].length).fill("");
    setCurrentAnnex({
      ...currentAnnex,
      contentTable: [...currentAnnex.contentTable, newRow],
    });
  };

  const removeRow = () => {
    if (currentAnnex.contentTable.length <= 1) return;
    setCurrentAnnex({
      ...currentAnnex,
      contentTable: currentAnnex.contentTable.slice(0, -1),
    });
  };

  const addColumn = () => {
    const newData = currentAnnex.contentTable.map((row) => [...row, ""]);
    setCurrentAnnex({ ...currentAnnex, contentTable: newData });
  };

  const removeColumn = () => {
    if (currentAnnex.contentTable[0].length <= 1) return;
    const newData = currentAnnex.contentTable.map((row) => row.slice(0, -1));
    setCurrentAnnex({ ...currentAnnex, contentTable: newData });
  };

  const handleCellChange = (rowIndex, colIndex, val) => {
    const updatedTable = currentAnnex.contentTable.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? val : cell,
      ),
    );
    setCurrentAnnex({ ...currentAnnex, contentTable: updatedTable });
  };

  const removeLink = (linkIdx) => {
    setCurrentAnnex({
      ...currentAnnex,
      contentLinks: currentAnnex.contentLinks.filter((_, i) => i !== linkIdx),
    });
  };

  const isEditing = editingIndex !== null;

  return (
    <Stack gap="xl">
      {/* FORMULARIO SUPERIOR (CREACIÓN / EDICIÓN) */}
      <Paper
        withBorder
        p="md"
        bg={isEditing ? "blue.0" : "gray.0"}
        radius="md"
        style={{
          borderColor: isEditing ? "var(--mantine-color-blue-4)" : undefined,
        }}
      >
        <Group justify="space-between" align="center" mb="md">
          <Text fw={700} size="sm" c={isEditing ? "blue.9" : "dark"}>
            {isEditing
              ? `Editando Anexo ${annexes[editingIndex]?.id || ""}`
              : `Añadir Nuevo Anexo (${generateLetterId(annexes.length)})`}
          </Text>
          {isEditing && (
            <Button
              size="compact-xs"
              variant="subtle"
              color="gray"
              leftSection={<IconX size={14} />}
              onClick={resetForm}
            >
              Cancelar edición
            </Button>
          )}
        </Group>

        <Stack gap="sm">
          <TextInput
            label="Título del Anexo"
            placeholder="Ej: Matriz de variables o Infografía técnica"
            required
            value={currentAnnex.title}
            onChange={(e) =>
              setCurrentAnnex({ ...currentAnnex, title: e.target.value })
            }
          />

          <Textarea
            label="Descripción / Nota APA (Opcional)"
            placeholder="Nota: Tomado de..."
            autosize
            minRows={2}
            value={currentAnnex.description}
            onChange={(e) =>
              setCurrentAnnex({ ...currentAnnex, description: e.target.value })
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
            value={currentAnnex.type}
            onChange={(val) =>
              setCurrentAnnex({ ...currentAnnex, type: val || "text" })
            }
          />

          {/* 🖼️ IMAGEN */}
          {currentAnnex.type === "image" && (
            <Stack gap="xs">
              {!currentAnnex.contentImage.isLocal ? (
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
                    setCurrentAnnex({
                      ...currentAnnex,
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
                disabled={currentAnnex.contentImage.isLocal}
                value={
                  currentAnnex.contentImage.isLocal
                    ? "Archivo local cargado"
                    : currentAnnex.contentImage.fileUrl
                }
                onChange={(e) =>
                  setCurrentAnnex({
                    ...currentAnnex,
                    contentImage: {
                      ...currentAnnex.contentImage,
                      fileUrl: e.target.value,
                    },
                  })
                }
              />
            </Stack>
          )}

          {/* 📊 TABLA */}
          {currentAnnex.type === "table" && (
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
                    {currentAnnex.contentTable.length}
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
                    {currentAnnex.contentTable[0].length}
                  </Text>
                  <ActionIcon variant="light" color="blue" onClick={addColumn}>
                    <IconPlus size={14} />
                  </ActionIcon>
                </Group>
              </Group>

              <Box style={{ overflowX: "auto" }}>
                <Table
                  variant="unstyled"
                  style={{ border: "1px solid #dee2e6" }}
                >
                  <Table.Tbody>
                    {currentAnnex.contentTable.map((row, rIdx) => (
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

          {/* 🔗 ENLACES */}
          {currentAnnex.type === "links" && (
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
                  onClick={() => {
                    if (tempLink.url) {
                      setCurrentAnnex({
                        ...currentAnnex,
                        contentLinks: [...currentAnnex.contentLinks, tempLink],
                      });
                      setTempLink({ label: "", url: "" });
                    }
                  }}
                >
                  Añadir
                </Button>
              </Group>
              <Stack gap={4}>
                {currentAnnex.contentLinks.map((l, i) => (
                  <Group key={i} justify="space-between">
                    <Text size="xs" c="blue.7" fw={600}>
                      • {l.label || l.url}
                    </Text>
                    <ActionIcon
                      size="xs"
                      color="red"
                      variant="subtle"
                      onClick={() => removeLink(i)}
                    >
                      <IconTrash size={12} />
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>
            </Paper>
          )}

          {/* 🔤 TEXTO */}
          {currentAnnex.type === "text" && (
            <Textarea
              label="Cuerpo del Texto"
              placeholder="Redacte el anexo..."
              minRows={4}
              value={currentAnnex.contentText}
              onChange={(e) =>
                setCurrentAnnex({
                  ...currentAnnex,
                  contentText: e.target.value,
                })
              }
            />
          )}

          <Group gap="xs" mt="md">
            <Button
              leftSection={
                isEditing ? <IconCheck size={16} /> : <IconPlus size={16} />
              }
              onClick={handleSaveAnnex}
              style={{ flex: 1 }}
              color={isEditing ? "green" : "blue"}
            >
              {isEditing
                ? "Guardar Cambios del Anexo"
                : "Añadir a la Lista de Anexos"}
            </Button>
            {isEditing && (
              <Button variant="default" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </Group>
        </Stack>
      </Paper>

      {/* LISTADO INFERIOR DE ANEXOS */}
      <Stack gap="sm">
        {annexes.length === 0 && (
          <Text size="sm" c="dimmed" ta="center" py="md">
            No hay anexos agregados todavía.
          </Text>
        )}

        {annexes.map((item, index) => {
          const isItemEditing = editingIndex === index;

          return (
            <Paper
              key={item.id || index}
              withBorder
              p="sm"
              shadow="xs"
              style={{
                borderColor: isItemEditing
                  ? "var(--mantine-color-blue-5)"
                  : undefined,
                backgroundColor: isItemEditing ? "#f0f7ff" : "white",
              }}
            >
              <Group align="center" justify="space-between">
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text fw={700} c="blue.8" size="sm" truncate>
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
                    variant={isItemEditing ? "filled" : "subtle"}
                    color="blue"
                    title="Editar anexo"
                    onClick={() => handleStartEdit(index)}
                  >
                    <IconPencil size={16} />
                  </ActionIcon>
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
          );
        })}
      </Stack>
    </Stack>
  );
};

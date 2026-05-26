// src/features/editor/components/config/forms/TOCForm.jsx
import React from "react";
import {
  Stack,
  Paper,
  Text,
  Group,
  ThemeIcon,
  Badge,
  SimpleGrid,
} from "@mantine/core";
import {
  IconListDetails,
  IconTable,
  IconPhoto,
  IconPaperclip,
  IconCircleCheck,
} from "@tabler/icons-react";
import { useStore } from "@store";
import { generateAllLists } from "@logic/engine/tocEngine";

export const TOCForm = () => {
  const { blocks, pages, projectMetadata } = useStore();

  const allLists = generateAllLists(blocks, pages, projectMetadata);

  // Función encargada de buscar el elemento en el dom de la previsualización y hacer scroll
  const scrollToSection = (id) => {
    const element = document.getElementById(`toc-sheet-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const estadisticas = [
    {
      id: "contenido",
      title: "Índice de Contenido",
      count: allLists.contenido.length,
      icon: <IconListDetails size={20} />,
      color: "blue",
      description: "Títulos H1, H2, H3 y preliminares detectados.",
    },
    {
      id: "tablas",
      title: "Lista de Tablas",
      count: allLists.tablas.length,
      icon: <IconTable size={20} />,
      color: "teal",
      description: "Bloques de tabla insertados en el cuerpo.",
    },
    {
      id: "figuras",
      title: "Lista de Figuras",
      count: allLists.figuras.length,
      icon: <IconPhoto size={20} />,
      color: "grape",
      description: "Imágenes, diagramas e ilustraciones detectadas.",
    },
    {
      id: "anexos",
      title: "Lista de Anexos",
      count: allLists.anexos.length,
      icon: <IconPaperclip size={20} />,
      color: "orange",
      description: "Material complementario activo al final del documento.",
    },
  ];

  return (
    <Stack gap="xl">
      <Paper withBorder p="md" bg="blue.0" style={{ borderStyle: "dashed" }}>
        <Text size="xs" fw={700} c="blue.9" mb={5}>
          PANEL DE NAVEGACIÓN DE ÍNDICES
        </Text>
        <Text size="xs" c="blue.9" style={{ lineHeight: 1.4 }}>
          Haz clic sobre cualquiera de las tarjetas de abajo para desplazar la
          previsualización de la derecha directamente hacia esa hoja específica.
        </Text>
      </Paper>

      <Text fw={700} size="lg">
        Selecciona la lista que deseas inspeccionar:
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2 }} gap="md">
        {estadisticas.map((item) => {
          const isClickable = item.count > 0 || item.id === "contenido";

          return (
            <Paper
              key={item.id}
              withBorder
              p="md"
              radius="md"
              shadow="xs"
              bg="white"
              // Solo habilitamos estilos de click si la hoja existe (tiene elementos o es la general)
              onClick={() => isClickable && scrollToSection(item.id)}
              style={{
                cursor: isClickable ? "pointer" : "not-allowed",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                opacity: isClickable ? 1 : 0.6,
              }}
              // Efecto hover sutil de Mantine/CSS simulado
              sx={
                isClickable
                  ? {
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "var(--mantine-shadow-md)",
                        borderColor: "var(--mantine-color-blue-filled)",
                      },
                    }
                  : undefined
              }
            >
              <Group justify="space-between" mb="xs">
                <ThemeIcon
                  color={item.color}
                  variant="light"
                  size="lg"
                  radius="md"
                >
                  {item.icon}
                </ThemeIcon>
                <Badge
                  color={item.count > 0 ? item.color : "gray"}
                  variant="filled"
                  size="lg"
                >
                  {item.count} {item.count === 1 ? "elemento" : "elementos"}
                </Badge>
              </Group>

              <Text fw={700} size="sm" mb={4}>
                {item.title}
              </Text>

              <Text size="xs" c="dimmed" mb="sm">
                {item.description}
              </Text>

              <Group gap={4}>
                <IconCircleCheck
                  size={14}
                  color={isClickable ? "#40c057" : "#868e96"}
                />
                <Text size="xs" c={isClickable ? "green.7" : "dimmed"} fw={500}>
                  {item.id === "contenido"
                    ? "Ir al índice general"
                    : item.count > 0
                      ? "Haz clic para enfocar esta hoja"
                      : "Hoja oculta (sin elementos)"}
                </Text>
              </Group>
            </Paper>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
};

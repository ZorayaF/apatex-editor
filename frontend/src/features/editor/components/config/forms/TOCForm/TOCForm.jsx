import {
  Stack,
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
import classes from "./TOCForm.module.css";

export const TOCForm = () => {
  const { blocks, pages, projectMetadata } = useStore();

  const allLists = generateAllLists(blocks, pages, projectMetadata);

  // Desplazamiento dinámico hacia el ID de la hoja de previsualización objetivo
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
      count: allLists?.contenido?.length || 0,
      icon: <IconListDetails size={20} />,
      color: "blue",
      description: "Títulos H1, H2, H3 y preliminares detectados.",
    },
    {
      id: "tablas",
      title: "Lista de Tablas",
      count: allLists?.tablas?.length || 0,
      icon: <IconTable size={20} />,
      color: "teal",
      description: "Bloques de tabla insertados en el cuerpo.",
    },
    {
      id: "figuras",
      title: "Lista de Figuras",
      count: allLists?.figuras?.length || 0,
      icon: <IconPhoto size={20} />,
      color: "grape",
      description: "Imágenes, diagramas e ilustraciones detectadas.",
    },
    {
      id: "anexos",
      title: "Lista de Anexos",
      count: allLists?.anexos?.length || 0,
      icon: <IconPaperclip size={20} />,
      color: "orange",
      description: "Material complementario activo al final del documento.",
    },
  ];

  return (
    <Stack gap="xl">
      {/* Directriz superior de navegación purificada por CSS */}
      <div className={classes.panelDirective}>
        <p className={classes.directiveLabel}>PANEL DE NAVEGACIÓN DE ÍNDICES</p>
        <p className={classes.directiveText}>
          Haz clic sobre cualquiera de las tarjetas de abajo para desplazar la
          previsualización de la derecha directamente hacia esa hoja específica.
        </p>
      </div>

      <Text fw={700} size="lg">
        Selecciona la lista que deseas inspeccionar:
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2 }} gap="md">
        {estadisticas.map((item) => {
          const isClickable = item.count > 0 || item.id === "contenido";

          // Conmutamos las clases CSS correspondientes según disponibilidad
          const cardClass = `${classes.metricCard} ${
            isClickable ? classes.cardClickable : classes.cardDisabled
          }`;

          return (
            <div
              key={item.id}
              className={cardClass}
              onClick={() => isClickable && scrollToSection(item.id)}
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
            </div>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
};

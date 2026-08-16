import React from "react";
import {
  Stack,
  Text,
  Box,
  Group,
  Switch,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import {
  IconFileCheck,
  IconNotes,
  IconBooks,
  IconHeart,
  IconAward,
  IconVocabulary,
  IconGavel,
  IconCircleCheckFilled,
  IconPaperclip,
  IconListDetails,
} from "@tabler/icons-react";
import classes from "./StructureSidebar.module.css";

export const StructureSidebar = ({
  activeSection,
  setActiveSection,
  metadata,
  onToggleSection,
}) => {
  const prelim = metadata?.preliminares || {};

  return (
    <Box
      component="nav"
      style={{
        height: "100%",
        borderRight: "1px solid #e9ecef",
        backgroundColor: "#ffffff",
      }}
    >
      <ScrollArea h="100%" p="md">
        <Stack gap="xl">
          {/* GRUPO 1: ELEMENTOS REQUERIDOS */}
          <Box>
            <SectionHeader label="Elementos Requeridos (APA)" />
            <Stack gap={4}>
              <NavItem
                label="Portada y Contraportada"
                icon={<IconFileCheck size={18} />}
                active={activeSection === "portada"}
                onClick={() => setActiveSection("portada")}
              />
              <NavItem
                label="Tabla de Contenido"
                icon={<IconListDetails size={18} />}
                active={activeSection === "toc"}
                onClick={() => setActiveSection("toc")}
              />
              <NavItem
                label="Resumen"
                icon={<IconNotes size={18} />}
                active={activeSection === "resumen"}
                onClick={() => setActiveSection("resumen")}
              />
              <NavItem
                label="Abstract"
                icon={<IconNotes size={18} />}
                active={activeSection === "abstract"}
                onClick={() => setActiveSection("abstract")}
              />
              <NavItem
                label="Referencias"
                icon={<IconBooks size={18} />}
                active={activeSection === "referencias"}
                onClick={() => setActiveSection("referencias")}
              />
              <NavItem
                label="Introducción"
                icon={<IconNotes size={18} />}
                active={activeSection === "introduccion"}
                onClick={() => setActiveSection("introduccion")}
              />
            </Stack>
          </Box>

          {/* GRUPO 2: SECCIONES OPCIONALES */}
          <Box>
            <SectionHeader label="Secciones Opcionales" />
            <Stack gap={4}>
              <NavItemToggle
                label="Dedicatoria"
                icon={<IconHeart size={18} />}
                active={activeSection === "dedicatoria"}
                enabled={Boolean(prelim.dedicatoria?.enabled)}
                onToggle={(val) =>
                  onToggleSection("preliminares.dedicatoria.enabled", val)
                }
                onClick={() => setActiveSection("dedicatoria")}
              />
              <NavItemToggle
                label="Agradecimientos"
                icon={<IconAward size={18} />}
                active={activeSection === "agradecimientos"}
                enabled={Boolean(prelim.agradecimientos?.enabled)}
                onToggle={(val) =>
                  onToggleSection("preliminares.agradecimientos.enabled", val)
                }
                onClick={() => setActiveSection("agradecimientos")}
              />
              <NavItemToggle
                label="Glosario"
                icon={<IconVocabulary size={18} />}
                active={activeSection === "glosario"}
                enabled={Boolean(prelim.glosario?.enabled)}
                onToggle={(val) =>
                  onToggleSection("preliminares.glosario.enabled", val)
                }
                onClick={() => setActiveSection("glosario")}
              />
              <NavItemToggle
                label="Anexos"
                icon={<IconPaperclip size={18} />}
                active={activeSection === "anexos"}
                enabled={Boolean(prelim.anexos?.enabled)}
                onToggle={(val) =>
                  onToggleSection("preliminares.anexos.enabled", val)
                }
                onClick={() => setActiveSection("anexos")}
              />
            </Stack>
          </Box>

          {/* GRUPO 3: LEGAL / INSTITUCIONAL */}
          <Box>
            <SectionHeader label="Legal / Institucional" />
            <Stack gap={4}>
              <NavItem
                label="Nota de Reglamento"
                icon={<IconGavel size={18} />}
                active={activeSection === "reglamento"}
                onClick={() => setActiveSection("reglamento")}
              />
              <NavItem
                label="Nota de Aceptación"
                icon={<IconCircleCheckFilled size={18} />}
                active={activeSection === "aceptacion"}
                onClick={() => setActiveSection("aceptacion")}
              />
            </Stack>
          </Box>
        </Stack>
      </ScrollArea>
    </Box>
  );
};

// --- SUBCOMPONENTES ---

const SectionHeader = ({ label }) => (
  <Text
    size="xs"
    fw={700}
    c="dimmed"
    mb="xs"
    style={{ textTransform: "uppercase", letterSpacing: "0.8px" }}
  >
    {label}
  </Text>
);

const NavItem = ({ label, icon, active, onClick }) => (
  <Box
    className={`${classes.navCard} ${active ? classes.navCardActive : ""}`}
    onClick={onClick}
  >
    <Group gap="sm" wrap="nowrap">
      <Box className={classes.iconWrapper}>{icon}</Box>
      <Text size="sm" fw={active ? 600 : 500} style={{ flex: 1 }}>
        {label}
      </Text>
    </Group>
  </Box>
);

const NavItemToggle = ({ label, icon, active, enabled, onToggle, onClick }) => (
  <Box
    className={`${classes.navCard} ${active ? classes.navCardActive : ""}`}
    onClick={onClick}
  >
    <Group justify="space-between" align="center" wrap="nowrap">
      <Group gap="sm" wrap="nowrap" style={{ flex: 1 }}>
        <Box className={classes.iconWrapper}>{icon}</Box>
        <Text size="sm" fw={active ? 600 : 500}>
          {label}
        </Text>
      </Group>

      {/* SWITCH CON BORDE AJUSTADO */}
      <Tooltip
        label={enabled ? "Desactivar sección" : "Activar sección"}
        position="left"
        withArrow
      >
        <Box
          className={`${classes.tightSwitch} ${
            enabled ? classes.tightSwitchActive : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(!enabled);
          }}
        >
          <Switch
            size="xs"
            color="blue"
            checked={enabled}
            onChange={() => {}}
            style={{ pointerEvents: "none" }}
          />
        </Box>
      </Tooltip>
    </Group>
  </Box>
);

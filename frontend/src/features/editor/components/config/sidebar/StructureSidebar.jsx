import {
  Stack,
  Text,
  NavLink,
  Box,
  Group,
  Switch,
  ScrollArea,
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
        borderRight: "1px solid #e0e0e0",
        backgroundColor: "#fcfcfc",
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
                enabled={prelim.dedicatoria?.enabled}
                onToggle={(val) =>
                  onToggleSection("preliminares.dedicatoria.enabled", val)
                }
                onClick={() => setActiveSection("dedicatoria")}
              />
              <NavItemToggle
                label="Agradecimientos"
                icon={<IconAward size={18} />}
                active={activeSection === "agradecimientos"}
                enabled={prelim.agradecimientos?.enabled}
                onToggle={(val) =>
                  onToggleSection("preliminares.agradecimientos.enabled", val)
                }
                onClick={() => setActiveSection("agradecimientos")}
              />
              <NavItemToggle
                label="Glosario"
                icon={<IconVocabulary size={18} />}
                active={activeSection === "glosario"}
                enabled={prelim.glosario?.enabled}
                onToggle={(val) =>
                  onToggleSection("preliminares.glosario.enabled", val)
                }
                onClick={() => setActiveSection("glosario")}
              />
              <NavItemToggle
                label="Anexos / Apéndices"
                icon={<IconPaperclip size={18} />}
                active={activeSection === "anexos"}
                enabled={prelim.anexos?.enabled}
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

// --- SUB-COMPONENTES INTERNOS ---

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

const NavItem = ({ label, icon, active, onClick, rightSection }) => (
  <NavLink
    label={label}
    leftSection={icon}
    active={active}
    onClick={onClick}
    rightSection={rightSection}
    variant="filled"
    color="blue"
    style={{ borderRadius: "6px" }}
  />
);

const NavItemToggle = ({ label, icon, active, enabled, onToggle, onClick }) => (
  <Group justify="space-between" wrap="nowrap" gap={0}>
    <NavLink
      label={label}
      leftSection={icon}
      active={active}
      onClick={onClick}
      disabled={!enabled && !active} // Bloquea clics si está desactivado y no activo
      variant="filled"
      color="blue"
      style={{
        borderRadius: "6px 0 0 6px",
        flex: 1,
        opacity: enabled ? 1 : 0.6,
      }}
    />
    <Box
      style={{
        border: "1px solid #f1f3f5",
        borderLeft: "none",
        borderRadius: "0 6px 6px 0",
        padding: "0 10px",
        display: "flex",
        alignItems: "center",
        height: "38px",
        backgroundColor: active ? "var(--mantine-color-blue-light)" : "white",
      }}
    >
      <Switch
        size="xs"
        checked={enabled}
        onChange={(e) => onToggle(e.currentTarget.checked)}
      />
    </Box>
  </Group>
);

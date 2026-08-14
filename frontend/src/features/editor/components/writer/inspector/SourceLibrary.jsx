// src/features/editor/components/writer/inspector/SourceLibrary.jsx
import React, { useState } from "react";
import {
  Stack,
  TextInput,
  ActionIcon,
  Group,
  Text,
  Card,
  Badge,
  ScrollArea,
  Tooltip,
  Popover,
  Button,
  Radio,
  Divider,
  SegmentedControl,
  Box,
} from "@mantine/core";
import {
  IconSearch,
  IconPencil,
  IconQuote,
  IconCheck,
  IconBooks,
  IconEdit,
  IconX,
} from "@tabler/icons-react";
import { useStore } from "@store";
import { notifications } from "@mantine/notifications";

export const SourceLibrary = () => {
  const {
    sources = [],
    setSelectedSourceId,
    selectedBlockId,
    insertCitation,
    lastCaretOffset,
    addAndEditSource,
    setActiveTab,
  } = useStore();

  const [search, setSearch] = useState("");
  const [openedPopover, setOpenedPopover] = useState(null);
  const [citeConfig, setCiteConfig] = useState({
    type: "parenthetical",
    page: "",
  });

  const filteredSources = sources.filter(
    (s) =>
      (s.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.author || "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleConfirmInsert = (sourceId) => {
    if (!selectedBlockId) {
      notifications.show({
        id: "citation-no-selection",
        message: "Haz clic sobre el párrafo donde deseas colocar la cita.",
        color: "orange",
        autoClose: 2500,
        withCloseButton: false,
      });
      return;
    }

    insertCitation(selectedBlockId, sourceId, lastCaretOffset || 0, citeConfig);
    setOpenedPopover(null);
    setCiteConfig({ type: "parenthetical", page: "" });
  };

  // Volver al panel principal inicial
  const handleExitLibrary = () => {
    setSelectedSourceId(null);
    setActiveTab("properties"); // Regresa a la vista neutral
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {/* 1. Cabecera con selector y botón de salida rápida */}
      <Box pb="xs" style={{ flexShrink: 0 }}>
        <Group gap="xs" align="center">
          <SegmentedControl
            style={{ flex: 1 }}
            size="xs"
            radius="md"
            value="library"
            onChange={(val) => {
              if (val === "editing") {
                addAndEditSource("articulo");
              }
            }}
            data={[
              {
                value: "library",
                label: (
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      justifyContent: "center",
                    }}
                  >
                    <IconBooks size={14} />
                    <span>Fuentes</span>
                  </Box>
                ),
              },
              {
                value: "editing",
                label: (
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      justifyContent: "center",
                    }}
                  >
                    <IconEdit size={14} />
                    <span>+ Nueva</span>
                  </Box>
                ),
              },
            ]}
          />
          <Tooltip
            label="Cerrar biblioteca y volver al inspector"
            withArrow
            position="bottom"
          >
            <ActionIcon
              variant="subtle"
              color="gray"
              size="md"
              onClick={handleExitLibrary}
            >
              <IconX size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Divider mt="xs" />
      </Box>

      {/* 2. Lista deslizable de referencias */}
      <ScrollArea
        style={{ flex: 1, minHeight: 0 }}
        scrollbarSize={6}
        type="hover"
        styles={{ viewport: { overflowX: "hidden" } }}
      >
        <Stack gap="sm" pt="xs" pb="md" pr="xs">
          <TextInput
            placeholder="Buscar por autor o título..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            size="xs"
          />

          {filteredSources.length === 0 ? (
            <Text c="dimmed" ta="center" mt="xl" size="xs">
              {sources.length === 0
                ? "No tienes referencias creadas aún."
                : "No se encontraron coincidencias."}
            </Text>
          ) : (
            filteredSources.map((source) => (
              <Card
                key={source.id}
                withBorder
                padding="xs"
                radius="md"
                shadow="xs"
              >
                <Stack gap={6}>
                  <Group justify="space-between" align="center">
                    <Badge size="xs" variant="light" color="blue">
                      {source.type || "ARTÍCULO"}
                    </Badge>

                    <Tooltip
                      label="Editar referencia"
                      withArrow
                      position="left"
                    >
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        onClick={() => setSelectedSourceId(source.id)}
                      >
                        <IconPencil size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>

                  <div>
                    <Text size="xs" fw={600} lineClamp={2}>
                      {source.title || "Sin título"}
                    </Text>
                    <Text size="11px" c="dimmed" mt={1}>
                      {source.author
                        ? `${source.author} (${source.year || "s.f."})`
                        : "Autor no definido"}
                    </Text>
                  </div>

                  <Popover
                    opened={openedPopover === source.id}
                    onClose={() => setOpenedPopover(null)}
                    position="left-start"
                    withArrow
                    shadow="md"
                    width={220}
                    trapFocus={false}
                  >
                    <Popover.Target>
                      <Button
                        size="xs"
                        variant="light"
                        color="blue"
                        fullWidth
                        leftSection={<IconQuote size={13} />}
                        onClick={() =>
                          setOpenedPopover(
                            openedPopover === source.id ? null : source.id,
                          )
                        }
                      >
                        Citar en texto
                      </Button>
                    </Popover.Target>

                    <Popover.Dropdown p="xs">
                      <Stack gap="xs">
                        <Text size="11px" fw={700} c="dimmed">
                          FORMATO APA
                        </Text>
                        <Radio.Group
                          value={citeConfig.type}
                          onChange={(val) =>
                            setCiteConfig({ ...citeConfig, type: val })
                          }
                          size="xs"
                        >
                          <Stack gap={4}>
                            <Radio
                              value="parenthetical"
                              label="Parentética (Autor, Año)"
                              size="xs"
                            />
                            <Radio
                              value="narrative"
                              label="Narrativa Autor (Año)"
                              size="xs"
                            />
                          </Stack>
                        </Radio.Group>

                        <TextInput
                          label="Página (Opcional)"
                          placeholder="ej. 31"
                          size="xs"
                          value={citeConfig.page}
                          onChange={(e) =>
                            setCiteConfig({
                              ...citeConfig,
                              page: e.target.value,
                            })
                          }
                          autoFocus
                        />

                        <Button
                          size="xs"
                          fullWidth
                          onClick={() => handleConfirmInsert(source.id)}
                        >
                          Insertar Cita
                        </Button>
                      </Stack>
                    </Popover.Dropdown>
                  </Popover>
                </Stack>
              </Card>
            ))
          )}
        </Stack>
      </ScrollArea>
    </Box>
  );
};

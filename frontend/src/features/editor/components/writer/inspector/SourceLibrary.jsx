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
} from "@mantine/core";
import {
  IconSearch,
  IconPencil,
  IconQuote,
  IconCheck,
  IconPlus,
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
        title: "Párrafo no seleccionado",
        message:
          "Haz clic sobre el párrafo donde deseas colocar la cita antes de insertar.",
        color: "orange",
        autoClose: 4000,
      });
      return;
    }

    insertCitation(selectedBlockId, sourceId, lastCaretOffset || 0, citeConfig);

    notifications.show({
      id: `cite-success-${sourceId}`,
      title: "Cita añadida",
      message: "La cita APA se ha insertado en la posición del cursor.",
      color: "teal",
      icon: <IconCheck size={16} />,
      autoClose: 2500,
    });

    setOpenedPopover(null);
    setCiteConfig({ type: "parenthetical", page: "" });
  };

  return (
    <Stack gap="md" h="100%">
      {/* Botón de acción principal dentro de Fuentes */}
      <Button
        leftSection={<IconPlus size={16} />}
        fullWidth
        onClick={() => addAndEditSource("articulo")}
      >
        Nueva Fuente
      </Button>

      <TextInput
        placeholder="Buscar por autor o título..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />

      <ScrollArea scrollbarSize={6} offsetScrollbars>
        <Stack gap="sm" pb="md">
          {filteredSources.length === 0 ? (
            <Text c="dimmed" ta="center" mt="xl" size="sm">
              {sources.length === 0
                ? "No hay fuentes registradas. Agrega una con el botón de arriba."
                : "No se encontraron coincidencias."}
            </Text>
          ) : (
            filteredSources.map((source) => (
              <Card
                key={source.id}
                withBorder
                padding="sm"
                radius="md"
                shadow="xs"
              >
                <Stack gap="xs">
                  {/* Fila superior: Tipo y Botón de Editar */}
                  <Group justify="space-between" align="center">
                    <Badge size="xs" variant="light" color="blue">
                      {source.type || "ARTÍCULO"}
                    </Badge>

                    <Tooltip
                      label="Editar datos de la fuente"
                      withArrow
                      position="left"
                    >
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        onClick={() => setSelectedSourceId(source.id)}
                      >
                        <IconPencil size={15} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>

                  {/* Datos bibliográficos */}
                  <div>
                    <Text size="sm" fw={600} lineClamp={2}>
                      {source.title || "Sin título"}
                    </Text>
                    <Text size="xs" c="dimmed" mt={2}>
                      {source.author
                        ? `${source.author} (${source.year || "s.f."})`
                        : "Autor no definido"}
                    </Text>
                  </div>

                  <Divider />

                  {/* Botón de Inserción claro con Popover integrado */}
                  <Popover
                    opened={openedPopover === source.id}
                    onClose={() => setOpenedPopover(null)}
                    position="left-start"
                    withArrow
                    shadow="md"
                    width={230}
                    trapFocus={false}
                  >
                    <Popover.Target>
                      <Button
                        size="xs"
                        variant="light"
                        color="blue"
                        fullWidth
                        leftSection={<IconQuote size={14} />}
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
                        <Text size="xs" fw={700} c="dimmed">
                          FORMATO APA
                        </Text>

                        <Radio.Group
                          value={citeConfig.type}
                          onChange={(val) =>
                            setCiteConfig({ ...citeConfig, type: val })
                          }
                          label="Estilo de cita"
                          size="xs"
                        >
                          <Stack gap={4} mt={5}>
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
                          mt="xs"
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
    </Stack>
  );
};

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
} from "@tabler/icons-react";
import { useStore } from "@store";
import { notifications } from "@mantine/notifications";

export const SourceLibrary = () => {
  const {
    sources,
    setSelectedSourceId,
    selectedBlockId,
    insertCitation,
    lastCaretOffset,
  } = useStore();

  // Estados locales para la configuración de la cita actual
  const [openedPopover, setOpenedPopover] = useState(null); // Guarda el ID de la fuente abierta
  const [citeConfig, setCiteConfig] = useState({
    type: "parenthetical",
    page: "",
  });

  const handleConfirmInsert = (sourceId) => {
    if (!selectedBlockId) {
      notifications.show({
        title: "Error de ubicación",
        message: "Haz clic en el párrafo donde quieras insertar la cita.",
        color: "red",
      });
      return;
    }

    // Enviamos la configuración (tipo y página) al Store
    insertCitation(selectedBlockId, sourceId, lastCaretOffset || 0, citeConfig);

    notifications.show({
      message: "Cita añadida al texto",
      color: "green",
      icon: <IconCheck size={16} />,
      autoClose: 2000,
    });

    // Limpiamos y cerramos
    setOpenedPopover(null);
    setCiteConfig({ type: "parenthetical", page: "" });
  };

  return (
    <Stack gap="md" h="100%">
      <TextInput
        placeholder="Buscar autor o título..."
        leftSection={<IconSearch size={16} />}
        mx="md"
        mt="md"
      />

      <ScrollArea scrollbarSize={4} offsetScrollbars px="md">
        <Stack gap="xs" pb="md">
          {sources.length === 0 ? (
            <Text c="dimmed" ta="center" mt="xl" size="sm">
              No hay fuentes en tu biblioteca.
            </Text>
          ) : (
            sources.map((source) => (
              <Card
                key={source.id}
                withBorder
                padding="sm"
                radius="md"
                shadow="xs"
              >
                <Stack gap={5}>
                  <Group justify="space-between" align="flex-start">
                    <Badge size="xs" variant="light">
                      {source.type}
                    </Badge>

                    <Group gap={4}>
                      {/* --- POPOVER DE CONFIGURACIÓN DE CITA --- */}
                      <Popover
                        opened={openedPopover === source.id}
                        onClose={() => setOpenedPopover(null)} // Cambiado de onChange para mayor estabilidad
                        position="left"
                        withArrow
                        shadow="md"
                        width={220}
                        trapFocus={false} // <--- IMPORTANTE: Permite que el teclado funcione sin pelear con el editor
                      >
                        <Popover.Target>
                          <Tooltip label="Configurar e insertar cita">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              size="sm"
                              onClick={() => {
                                // Si ya estaba abierto este, lo cerramos. Si no, abrimos este.
                                setOpenedPopover(
                                  openedPopover === source.id
                                    ? null
                                    : source.id,
                                );
                              }}
                            >
                              <IconQuote size={14} />
                            </ActionIcon>
                          </Tooltip>
                        </Popover.Target>

                        {/* QUITAMOS el onMouseDown={(e) => e.preventDefault()} de aquí */}
                        <Popover.Dropdown>
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

                            <Divider />

                            <TextInput
                              label="Página (Opcional)"
                              placeholder="ej. 31"
                              size="xs"
                              value={citeConfig.page}
                              // Ahora sí podrás escribir aquí
                              onChange={(e) =>
                                setCiteConfig({
                                  ...citeConfig,
                                  page: e.target.value,
                                })
                              }
                              autoFocus // Para que puedas escribir apenas abras el modal
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

                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        onClick={() => setSelectedSourceId(source.id)}
                      >
                        <IconPencil size={14} />
                      </ActionIcon>
                    </Group>
                  </Group>

                  <Text size="sm" fw={600} lineClamp={1}>
                    {source.title || "Sin título"}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {source.author
                      ? `${source.author} (${source.year || "s.f."})`
                      : "Datos incompletos"}
                  </Text>
                </Stack>
              </Card>
            ))
          )}
        </Stack>
      </ScrollArea>
    </Stack>
  );
};

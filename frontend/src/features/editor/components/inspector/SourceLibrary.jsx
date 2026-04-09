// src/features/editor/components/inspector/tabs/SourceLibrary.jsx
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
} from "@mantine/core";
import { IconSearch, IconPencil, IconQuote } from "@tabler/icons-react";
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

  const handleInsert = (e, sourceId) => {
    // Evitamos que el clic en la barra lateral le robe el foco al editor
    e.preventDefault();

    // 1. Verificación de seguridad: ¿Hay un bloque seleccionado?
    if (!selectedBlockId) {
      notifications.show({
        title: "Selecciona un párrafo",
        message: "Haz clic en el texto donde quieras poner la cita primero.",
        color: "blue",
      });
      return;
    }

    // 2. Insertamos la cita usando el ID de la fuente y la posición guardada
    // Usamos lastCaretOffset || 0 por si acaso el valor es null
    insertCitation(selectedBlockId, sourceId, lastCaretOffset || 0);

    notifications.show({
      message: "Cita insertada correctamente",
      color: "green",
      autoClose: 2000,
    });
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
                      <Tooltip
                        label="Insertar cita (Autor, Año)"
                        position="left"
                      >
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="sm"
                          // Importante: onMouseDown previene la pérdida de foco mejor que onClick
                          onMouseDown={(e) => handleInsert(e, source.id)}
                        >
                          <IconQuote size={14} />
                        </ActionIcon>
                      </Tooltip>

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

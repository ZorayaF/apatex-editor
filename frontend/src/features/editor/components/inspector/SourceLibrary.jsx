import {
  Stack,
  TextInput,
  ActionIcon,
  Group,
  Text,
  Card,
  Badge,
  ScrollArea,
} from "@mantine/core";
import {
  IconSearch,
  IconPencil,
  IconTrash,
  IconQuote,
} from "@tabler/icons-react";
import { useStore } from "@store";

export const SourceLibrary = () => {
  const { sources, setSelectedSourceId } = useStore();

  return (
    <Stack gap="md" h="100%">
      <TextInput
        placeholder="Buscar autor o título..."
        leftSection={<IconSearch size={16} />}
        mx="md"
      />

      <ScrollArea scrollbarSize={4} offsetScrollbars px="md">
        <Stack gap="xs">
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
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={() => setSelectedSourceId(source.id)}
                      >
                        <IconPencil size={14} />
                      </ActionIcon>
                      {/* Aquí iría el de borrar */}
                    </Group>
                  </Group>

                  <Text size="sm" fw={600} lineClamp={1}>
                    {source.title || "Sin título"}
                  </Text>

                  <Text size="xs" c="dimmed">
                    {source.author
                      ? `${source.author} (${source.year})`
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

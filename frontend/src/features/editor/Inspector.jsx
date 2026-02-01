import { Stack, Paper, Text } from '@mantine/core';

export function Inspector() {
  return (
    <>
      <Text fw={700} mb="md">Asistente APA</Text>
      <Stack>
        <Paper withBorder p="xs" bg="blue.0">
          <Text size="xs" c="blue.9" fw={700}>Tip Politeca:</Text>
          <Text size="xs">Recuerda: Los párrafos llevan sangría de 1.27cm en la primera línea.</Text>
        </Paper>
        <Paper withBorder p="xs">
          <Text size="xs" fw={500}>Estadísticas</Text>
          <Text size="xs" c="dimmed">Palabras: 0</Text>
        </Paper>
      </Stack>
    </>
  );
}

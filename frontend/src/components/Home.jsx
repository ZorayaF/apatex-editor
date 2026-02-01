import { Container, Title, Button, Stack, Paper, Text, Group } from '@mantine/core';
import { useDocStore } from '../store/useDocStore';

export function Home() {
  const setPage = useDocStore((state) => state.setPage);

  return (
    <Container size="sm" py={100}>
      <Paper shadow="xl" p={50} radius="md" withBorder>
        <Stack align="center" gap="xl">
          <Title order={1} c="blue.9">APATEX</Title>
          <Text c="dimmed" ta="center">Sistema WYSIWYM para Normas APA - Universidad de Boyacá</Text>

          <Group w="100%" grow>
            <Button size="lg" onClick={() => setPage('editor')}>
              Nuevo Proyecto
            </Button>
            <Button size="lg" variant="outline" color="gray">
              Abrir Archivo
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}

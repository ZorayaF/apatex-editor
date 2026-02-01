import { Stack, Text, NavLink, Button } from '@mantine/core';
import { useDocStore } from '../../store/useDocStore';

export function Sidebar() {
  const blocks = useDocStore((state) => state.blocks);

  return (
    <>
      <Text fw={700} mb="md" size="xs" c="dimmed">ESTRUCTURA</Text>
      <Stack gap={5}>
        {blocks
          .filter((b) => b.type === 'h1')
          .map((b) => (
            <NavLink
              key={b.id}
              label={b.content || 'Sin título'}
              variant="light"
              active={false} // Aquí pondremos lógica de activo luego
            />
          ))}
      </Stack>

      <Stack mt="auto" pt="md">
        <Button variant="light" size="xs">Exportar PDF</Button>
      </Stack>
    </>
  );
}

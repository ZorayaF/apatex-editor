import { AppShell, Group, Text, Burger, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useDocStore } from '../../store/useDocStore';
import { Sidebar } from './Sidebar';
import { Inspector } from './Inspector';
import { Canvas } from './Canvas';

export function Editor() {
  const [opened, { toggle }] = useDisclosure();
  const setPage = useDocStore((state) => state.setPage);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      aside={{ width: 300, breakpoint: 'md' }}
      padding="md"
    >
      <AppShell.Header p="md" bg="#003366" c="white">
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="white" />
            <Text fw={700}>APATEX - UniBoyacá</Text>
          </Group>
          <Button variant="white" size="xs" c="dark" onClick={() => setPage('home')}>
            Salir
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main bg="gray.1">
        <Canvas />
      </AppShell.Main>

      <AppShell.Aside p="md">
        <Inspector />
      </AppShell.Aside>
    </AppShell>
  );
}

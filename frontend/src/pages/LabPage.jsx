// src/pages/LabPage.jsx
import { Canvas } from '@features/editor/components/canvas/Canvas';
import { Button, Group } from '@mantine/core';
import { useDocumentStore } from '@store/useDocumentStore';

const LabPage = () => {
  const addBlock = useDocumentStore((state) => state.addBlock);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Group p="md" bg="white" style={{ borderBottom: '1px solid #ddd' }}>
        <Button onClick={() => addBlock('h1', 'Nuevo Título')}>+ Título</Button>
        <Button onClick={() => addBlock('paragraph', 'Nuevo Párrafo')}>+ Párrafo</Button>
      </Group>

      {/* El Canvas ya es inteligente, no necesita children */}
      <Canvas />
    </div>
  );
};

// src/pages/LabPage.jsx
import { Canvas } from '@features/editor/components/canvas/Canvas';
import { Button, Group, Text } from '@mantine/core';
import { useDocumentStore } from '@store/useDocumentStore';

const LabPage = () => {
  // Extraemos lo necesario del Store
  const addBlock = useDocumentStore((state) => state.addBlock);
  const deleteBlock = useDocumentStore((state) => state.deleteBlock);
  const selectedBlockId = useDocumentStore((state) => state.selectedBlockId);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Group p="md" bg="white" style={{ borderBottom: '1px solid #ddd', gap: '10px' }}>
        <Button variant="light" onClick={() => addBlock('h1', 'NUEVO TÍTULO')}>+ Título</Button>
        <Button variant="light" color="gray" onClick={() => addBlock('paragraph', 'Nuevo párrafo...')}>+ Párrafo</Button>

        <div style={{ borderLeft: '1px solid #eee', height: '30px', margin: '0 10px' }} />

        {/* Botón de Eliminar: Solo se activa si hay algo seleccionado */}
        <Button
          color="red"
          variant="filled"
          disabled={!selectedBlockId}
          onClick={() => deleteBlock(selectedBlockId)}
        >
          Eliminar Bloque
        </Button>

        {selectedBlockId && (
          <Text size="xs" c="dimmed">ID Activo: {selectedBlockId.slice(0, 8)}...</Text>
        )}
      </Group>

      <Canvas />
    </div>
  );
};

export default LabPage;

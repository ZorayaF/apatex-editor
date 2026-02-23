// src/pages/LabPage.jsx
import { Canvas } from '@features/editor/components/canvas/Canvas';
import { Button, Group, Text } from '@mantine/core';
import { useDocumentStore } from '@store/useDocumentStore';

const LabPage = () => {
  const { addBlock, deleteBlock, addPage, selectedBlockId } = useDocumentStore();

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Group p="md" bg="white" style={{ borderBottom: '1px solid #ddd', gap: '10px' }}>
        <Button variant="light" onClick={() => addBlock('h1', 'NUEVO TÍTULO')}>+ Título</Button>
        <Button variant="light" color="gray" onClick={() => addBlock('paragraph', 'Nuevo párrafo')}>+ Párrafo</Button>

        {/* NUEVO BOTÓN */}
        <Button variant="outline" color="blue" onClick={addPage}>
          + Nueva Página
        </Button>

        <div style={{ borderLeft: '1px solid #eee', height: '30px', margin: '0 10px' }} />

        <Button color="red" disabled={!selectedBlockId} onClick={() => deleteBlock(selectedBlockId)}>
          Eliminar Bloque
        </Button>
      </Group>

      <Canvas />
    </div>
  );
};
export default LabPage;

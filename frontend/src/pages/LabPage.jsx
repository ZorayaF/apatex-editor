import React from 'react';
import { Button, Group, Stack, Text, Title, Divider } from '@mantine/core';
import { useDocumentStore } from '@store/useDocumentStore';
import { Canvas } from '@features/editor/components/canvas/Canvas';
import { BlockWrapper } from '@features/editor/components/canvas/BlockWrapper';

const LabPage = () => {
  // 1. Conectamos con el Store
  const { blocks, addBlock, deleteBlock } = useDocumentStore();
  const [selectedId, setSelectedId] = React.useState(null);

  return (
    <Stack gap={0} style={{ height: '100vh' }}>
      {/* Mini Toolbar Experimental (Simulando el futuro Header) */}
      <Group p="md" bg="white" style={{ borderBottom: '1px solid #e9ecef', zIndex: 10 }}>
        <Text size="sm" fw={700} c="blue">LAB-CONTROL:</Text>
        <Button
          variant="light"
          onClick={() => addBlock('h1', 'NUEVO TÍTULO NIVEL 1')}
        >
          + Título
        </Button>
        <Button
          variant="light"
          color="gray"
          onClick={() => addBlock('paragraph', 'Este es un nuevo párrafo de ejemplo siguiendo las normas de la Universidad de Boyacá.')}
        >
          + Párrafo
        </Button>
        <Divider orientation="vertical" />
        <Button
          variant="subtle"
          color="red"
          disabled={!selectedId}
          onClick={() => {
            deleteBlock(selectedId);
            setSelectedId(null);
          }}
        >
          Eliminar Seleccionado
        </Button>
      </Group>

      {/* 2. El Lienzo (Canvas) estable */}
      <Canvas>
        {blocks.length === 0 && (
          <Text c="dimmed" ta="center" mt="xl">La página está vacía. Añade un bloque arriba.</Text>
        )}

        {blocks.map((block) => (
          <BlockWrapper
            key={block.id}
            isSelected={selectedId === block.id}
            onClick={() => setSelectedId(block.id)}
          >
            {/* Renderizado dinámico según el tipo de bloque */}
            {block.type === 'h1' && (
              <Title order={1} style={{
                fontSize: '12pt',
                textAlign: 'center',
                fontFamily: 'Times New Roman, serif'
              }}>
                {block.content}
              </Title>
            )}

            {block.type === 'paragraph' && (
              <Text style={{
                fontSize: '12pt',
                textAlign: 'justify',
                fontFamily: 'Times New Roman, serif'
              }}>
                {block.content}
              </Text>
            )}
          </BlockWrapper>
        ))}
      </Canvas>
    </Stack>
  );
};

export default LabPage;

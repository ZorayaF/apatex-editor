import { Paper, Stack, Title, Text, TextInput, Group, Button } from '@mantine/core';
import { useDocStore } from '../../store/useDocStore';

export function Canvas() {
  const { blocks, updateBlock, addBlock } = useDocStore();

  return (
    <Stack align="center" w="100%">

      {/* Barra de Herramientas Flotante */}
      <Paper shadow="xs" p="xs" radius="md" withBorder mb="md">
        <Group gap="xs">
          <Button variant="light" size="xs" onClick={() => addBlock('h1')}>+ Título 1</Button>
          <Button variant="light" size="xs" onClick={() => addBlock('h2')}>+ Título 2</Button>
          <Button variant="light" size="xs" onClick={() => addBlock('p')}>+ Párrafo</Button>
          <Button variant="light" size="xs" color="green" onClick={() => addBlock('table')}>+ Tabla</Button>
        </Group>
      </Paper>

      {/* La Hoja de Papel */}
      <Paper
        shadow="md"
        p="3cm"
        bg="white"
        style={{
          width: '21.59cm',
          minHeight: '27.94cm',
          fontFamily: 'Times New Roman, serif'
        }}
      >
        <Stack gap="xl">
          {blocks.map((block) => (
            <div key={block.id}>
              {block.type === 'h1' && (
                <Title order={1} style={{ fontSize: '12pt', textAlign: 'center' }}>
                  <TextInput
                    variant="unstyled"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value.toUpperCase())}
                    styles={{ input: { textAlign: 'center', fontWeight: 'bold' } }}
                    placeholder="TÍTULO CAPÍTULO"
                  />
                </Title>
              )}
              {block.type === 'h2' && (
                <Title order={2} style={{ fontSize: '12pt', textAlign: 'left' }}>
                  <TextInput
                    variant="unstyled"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    styles={{ input: { fontWeight: 'bold' } }}
                    placeholder="Subtítulo..."
                  />
                </Title>
              )}
              {block.type === 'p' && (
                <Text style={{ textAlign: 'justify', lineHeight: 1.5, textIndent: '1.27cm' }}>
                  <TextInput
                    variant="unstyled"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    styles={{ input: { fontSize: '12pt', lineHeight: '1.5' } }}
                    placeholder="Escribe aquí..."
                  />
                </Text>
              )}
            </div>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

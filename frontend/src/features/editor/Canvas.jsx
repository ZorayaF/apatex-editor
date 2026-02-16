import { Stack, Paper } from '@mantine/core';
import { useDocStore } from '../../store/useDocStore';
import { BlockWrapper } from './components/blocks/BlockWrapper';
import { TextElement } from './components/blocks/TextElement';

export function Canvas() {
  const blocks = useDocStore((state) => state.blocks);

  return (
    <Stack align="center" py="xl" style={{ overflowY: 'auto', height: '100%' }}>
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
        <Stack gap="xs">
          {blocks.map((block) => (
            <BlockWrapper key={block.id} blockId={block.id}>
              <TextElement block={block} />
            </BlockWrapper>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

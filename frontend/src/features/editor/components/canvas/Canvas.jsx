// src/features/editor/components/canvas/Canvas.jsx
import React from 'react';
import { Box } from '@mantine/core';
import { useDocumentStore } from '@store/useDocumentStore';
import { Page } from './Page';
import { BlockWrapper } from './BlockWrapper';
import { EditableBlock } from './EditableBlock';

export const Canvas = () => {
  // 1. Obtenemos los bloques directamente del Store
  const blocks = useDocumentStore((state) => state.blocks);

  return (
    <Box
      p={40}
      className="canvas-viewport"
      style={{
        backgroundColor: '#f1f3f5',
        height: 'calc(100vh - 60px)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Page pageNumber={1}>
        {/* 2. Mapeamos los bloques aquí adentro */}
        {blocks.map((block) => (
          <BlockWrapper key={block.id} blockId={block.id}>
            <EditableBlock
              id={block.id}
              content={block.content}
              type={block.type}
            />
          </BlockWrapper>
        ))}
      </Page>
    </Box>
  );
};

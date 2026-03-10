// src/features/editor/components/canvas/Canvas.jsx
import React from 'react';
import { Box } from '@mantine/core';
import { useStore } from '@store';
import { Page } from './Page';
import { BlockWrapper } from '../blocks/core/BlockWrapper';
import { BlockFactory } from '../blocks/core/BlockFactory';

export const Canvas = () => {
  const { pages, blocks } = useStore();

  return (
    <Box
      className="canvas-viewport"
      style={{
        backgroundColor: '#f1f3f5',
        height: 'calc(100vh - 60px)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0'
      }}
    >
      {pages.map((page, index) => (
        <Page key={page.id} pageNumber={index + 1}>
          {page.blockIds.map((blockId) => {
            // 1. Buscamos el bloque
            const blockData = blocks.find(b => b.id === blockId);

            // 2. Si por algún error de sincronización el bloque no existe,
            // saltamos este renderizado para no romper la app.
            if (!blockData) return null;

            return (
              <BlockWrapper key={blockId} blockId={blockId}>
                {/* 3. LLAMADA CORRECTA: Como componente React con props */}
                <BlockFactory block={blockData} />
              </BlockWrapper>
            );
          })}
        </Page>
      ))}
    </Box>
  );
};

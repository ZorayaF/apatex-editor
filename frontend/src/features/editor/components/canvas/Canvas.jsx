// src/features/editor/components/canvas/Canvas.jsx
import React from 'react';
import { Box } from '@mantine/core';
import { useDocumentStore } from '@store';
import { Page } from './Page';
import { BlockWrapper } from '../blocks/core/BlockWrapper'; // Nueva ubicación
import { BlockFactory } from '../blocks/core/BlockFactory';

export const Canvas = () => {
  const { pages, blocks } = useDocumentStore();

  return (
    <Box className="canvas-viewport"
      style={{
        backgroundColor: '#f1f3f5',
        height: 'calc(100vh - 60px)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
      {pages.map((page, index) => (
        <Page key={page.id} pageNumber={index + 1}>
          {page.blockIds.map((blockId) => {
            const block = blocks.find(b => b.id === blockId);
            return (
              <BlockWrapper key={blockId} blockId={blockId}>
                {BlockFactory(block)}
              </BlockWrapper>
            );
          })}
        </Page>
      ))}
    </Box>
  );
};

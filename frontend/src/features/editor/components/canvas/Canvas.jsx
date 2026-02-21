import React from 'react';
import { Box } from '@mantine/core';
import { Page } from './Page'; // Importamos el nuevo componente

export const Canvas = ({ children }) => {
  return (
    <Box
      p={40}
      className="canvas-viewport"
      style={{
        backgroundColor: '#f1f3f5',
        height: 'calc(100vh - 60px)', // Ajustar según el tamaño de tu futuro Header
        overflowY: 'auto'
      }}
    >
      {/* Por ahora, renderizamos una sola página, pero ya está preparada para ser una lista */}
      <Page pageNumber={1}>
        {children}
      </Page>
    </Box>
  );
};

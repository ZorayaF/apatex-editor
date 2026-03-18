import React from 'react';
import { Box } from '@mantine/core';

// 1. IMPORTAR LOS ESTILOS (Asegúrate de que la ruta sea correcta según tu carpeta)
import '@editor/styles/editor.css';

import { Header } from '@editor/components/header';
import { Canvas } from '@editor/components/canvas/Canvas';

const LabPage = () => {
  return (
    <Box
      h="100vh"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Header />

      {/* 2. AÑADIMOS LA CLASE 'canvas-viewport' 
         Esta clase es la que activa el "counter-reset" en tu CSS 
         para que la numeración de los H1 empiece desde 1.
      */}
      <Box
        component="main"
        className="canvas-viewport"
        bg="gray.0"
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Canvas />
      </Box>
    </Box>
  );
};

export default LabPage;

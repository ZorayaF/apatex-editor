import React from 'react';
import { Box } from '@mantine/core';

// Asegúrate de que la ruta de importación coincida con tu estructura
import { Header } from '@editor/components/header';
import { Canvas } from '@editor/components/canvas/Canvas';

const LabPage = () => {
  // Nota: Ya no necesitamos importar useDocumentStore aquí.
  // La página es solo "Layout", la lógica vive dentro de Header y Canvas.

  return (
    <Box
      h="100vh"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden' // Evita scroll en el body, lo delegamos al canvas
      }}
    >
      {/* 1. Zona de Control (Sticky/Fijo) */}
      <Header />

      {/* 2. Zona de Trabajo (Flexible y Scrollable) */}
      <Box
        component="main"
        bg="gray.0" // Un fondo gris suave para distinguir el "papel" del fondo
        style={{
          flex: 1, // Ocupa todo el espacio restante
          position: 'relative',
          overflow: 'hidden' // El scroll lo manejará el componente Canvas internamente
        }}
      >
        <Canvas />
      </Box>
    </Box>
  );
};

export default LabPage;

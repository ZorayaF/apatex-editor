// src/features/editor/components/canvas/BlockWrapper.jsx
import React from 'react';
import { Box } from '@mantine/core';
import { useDocumentStore } from '@store/useDocumentStore';

export const BlockWrapper = ({ children, blockId }) => {
  const selectedBlockId = useDocumentStore((state) => state.selectedBlockId);
  const isSelected = selectedBlockId === blockId;

  return (
    <Box
      style={{
        position: 'relative',
        marginBottom: '10px',
        paddingLeft: '15px',
        // PRUEBA DE FUEGO: Si es seleccionado, el fondo DEBE ser rojo brillante
        // Si no se pone rojo al hacer clic, el problema es ZUSTAND.
        backgroundColor: isSelected ? 'rgba(255, 0, 0, 0.2)' : 'transparent',
        borderLeft: isSelected ? '10px solid blue' : '2px solid #eee',
        transition: 'all 0.1s ease',
      }}
    >
      {/* Texto de ayuda visual temporal */}
      {isSelected && <span style={{ fontSize: '8px', color: 'blue', position: 'absolute', left: 0 }}>ACTIVO</span>}

      {children}
    </Box>
  );
};

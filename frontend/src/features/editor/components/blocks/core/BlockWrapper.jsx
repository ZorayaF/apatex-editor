import React from 'react';
import { Box } from '@mantine/core';
import { useStore } from '@store';

/**
 * Envoltorio funcional para cada bloque del editor.
 * Proporciona el ID necesario para el motor de paginación y 
 * retroalimentación visual de selección.
 */
export const BlockWrapper = ({ children, blockId }) => {
  const selectedBlockId = useStore((state) => state.selectedBlockId);
  const isSelected = selectedBlockId === blockId;

  return (
    <Box
      data-block-id={blockId} // Atributo crítico para el motor de paginación
      className="editor-block-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        paddingLeft: '15px',
        marginBottom: '4px', // Espaciado sutil entre bloques

        // Indicador visual de selección (Línea lateral)
        borderLeft: isSelected
          ? '3px solid #228be6'
          : '3px solid transparent',

        // Fondo muy tenue para el bloque activo
        backgroundColor: isSelected
          ? 'rgba(34, 139, 230, 0.03)'
          : 'transparent',

        transition: 'all 0.15s ease',
      }}
    >
      {/* Nota: El padding y margen se manejan aquí para no interferir 
          con el cálculo de altura del contenido editable. 
      */}
      {children}
    </Box>
  );
};

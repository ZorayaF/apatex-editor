import { Box } from '@mantine/core';

export const BlockWrapper = ({ children, isSelected, onClick }) => {
  return (
    <Box
      onClick={onClick}
      style={{
        position: 'relative',
        padding: '4px 8px',
        marginBottom: '10px',
        cursor: 'pointer',
        borderRadius: '4px',
        // Resaltado sutil cuando el bloque está seleccionado
        backgroundColor: isSelected ? 'rgba(34, 139, 230, 0.05)' : 'transparent',
        borderLeft: isSelected ? '3px solid #228be6' : '3px solid transparent',
        transition: 'all 0.1s ease',
      }}
    >
      {children}
    </Box>
  );
};

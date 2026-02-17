import { Box, Group, ActionIcon } from '@mantine/core';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';
import { useBlockActions } from '@hooks/useBlockActions';

export function BlockWrapper({ children, blockId }) {
  // Conectamos con el hook para tener la función de borrar
  const { handleDelete } = useBlockActions();

  return (
    <Box
      className="block-wrapper"
      style={{
        position: 'relative',
        padding: '2px 0', // Un poco de aire vertical
        transition: 'background 0.2s'
      }}
      // Efecto hover sutil para saber qué bloque estás tocando
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      {/* --- Controles Flotantes (Izquierda) --- */}
      <Group
        gap={0}
        style={{
          position: 'absolute',
          left: -40, // Los sacamos del papel hacia la izquierda
          top: 8,
          opacity: 0, // Invisibles por defecto
          transition: 'opacity 0.2s'
        }}
        // Se vuelven visibles al hacer hover sobre el wrapper padre (usando CSS o lógica de estado)
        sx={{ '.block-wrapper:hover &': { opacity: 1 } }} // *Nota: En Mantine v7/v8 esto se maneja mejor con clases CSS, pero por ahora usaremos un truco visual abajo*
        className="controls-group"
      >
        <ActionIcon variant="subtle" color="gray" size="sm" style={{ cursor: 'grab' }}>
          <IconGripVertical size={14} />
        </ActionIcon>

        <ActionIcon
          variant="subtle"
          color="red"
          size="sm"
          onClick={() => handleDelete(blockId)}
        >
          <IconTrash size={14} />
        </ActionIcon>
      </Group>

      {/* Aquí se renderiza el texto (TextElement) */}
      <Box style={{ position: 'relative' }}>
        {children}
      </Box>

      {/* Pequeño truco para mostrar controles en hover sin CSS complejo */}
      <style>{`
        .block-wrapper:hover .controls-group {
          opacity: 1 !important;
        }
      `}</style>
    </Box>
  );
}

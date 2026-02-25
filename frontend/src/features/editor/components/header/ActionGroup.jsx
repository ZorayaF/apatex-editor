// features/editor/components/header/ActionGroup.jsx
import React from 'react';
import { Group } from '@mantine/core';
import { IconFilePlus, IconPhoto, IconTable, IconTrash } from '@tabler/icons-react';
import { useDocumentStore } from '@store';
import { HeaderButton } from './HeaderButton';

export const ActionGroup = () => {
  const { addPage, deleteBlock, selectedBlockId } = useDocumentStore();

  return (
    <Group gap={4}>
      {/* Elementos Estructurales */}
      <HeaderButton
        label="Página"
        description="Añadir una nueva página al final"
        icon={IconFilePlus}
        onClick={addPage}
      />

      {/* Features Futuros (Visualmente deshabilitados o logueando WIP) */}
      <HeaderButton
        label="Imagen"
        description="Insertar imagen (Próximamente)"
        icon={IconPhoto}
        onClick={() => console.log('WIP')}
      />

      {/* Acciones Destructivas */}
      {selectedBlockId && (
        <HeaderButton
          label="Borrar"
          description="Eliminar el bloque seleccionado"
          icon={IconTrash}
          onClick={() => deleteBlock(selectedBlockId)}
          color="red"
        // Nota: Podrías pasar el color 'red' a HeaderButton para que cambie el estilo si es destructivo
        />
      )}
    </Group>
  );
};

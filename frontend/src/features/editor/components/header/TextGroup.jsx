// features/editor/components/header/TextGroup.jsx
import React from 'react';
import { Group } from '@mantine/core';
import { IconH1, IconH2, IconTypography, IconQuote } from '@tabler/icons-react';
import { useDocumentStore } from '@store';
import { HeaderButton } from './HeaderButton';

export const TextGroup = () => {
  const { addBlock, selectedBlockId, blocks } = useDocumentStore();

  // Lógica para detectar el tipo activo
  const activeBlock = blocks.find((b) => b.id === selectedBlockId);
  const activeType = activeBlock ? activeBlock.type : null;

  return (
    <Group gap={4}>
      <HeaderButton
        label="Título 1"
        description="Encabezado principal de la sección"
        icon={IconH1}
        onClick={() => addBlock('h1')}
        isActive={activeType === 'h1'}
      />
      <HeaderButton
        label="Título 2"
        description="Subtítulo de sección"
        icon={IconH2}
        onClick={() => addBlock('h2')}
        isActive={activeType === 'h2'}
      />
      <HeaderButton
        label="Párrafo"
        description="Texto normal del cuerpo"
        icon={IconTypography}
        onClick={() => addBlock('paragraph')}
        isActive={activeType === 'paragraph'}
      />
      <HeaderButton
        label="Cita"
        description="Bloque de cita destacado"
        icon={IconQuote}
        onClick={() => addBlock('blockquote')}
        isActive={activeType === 'blockquote'}
      />
    </Group>
  );
};

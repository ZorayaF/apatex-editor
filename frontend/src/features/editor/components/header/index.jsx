// features/editor/components/header/index.jsx
import React from 'react';
import { Paper, Group, Divider, ScrollArea } from '@mantine/core';
import { TextGroup } from './TextGroup';
import { ActionGroup } from './ActionGroup';

export const Header = () => {
  return (
    <Paper
      h={80} // Aumentamos un poco la altura para acomodar el texto
      px="md"
      pos="sticky"
      top={0}
      style={{
        zIndex: 100,
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        backgroundColor: 'var(--mantine-color-white)'
      }}
      radius={0}
    >
      {/* ScrollArea permite que el header sea responsive en pantallas pequeñas */}
      <ScrollArea h="100%" type="never">
        <Group h="100%" align="center" wrap="nowrap">

          {/* Grupo 1: Textos */}
          <TextGroup />

          <Divider orientation="vertical" mx="xs" h={40} />

          {/* Grupo 2: Acciones */}
          <ActionGroup />

        </Group>
      </ScrollArea>
    </Paper>
  );
};

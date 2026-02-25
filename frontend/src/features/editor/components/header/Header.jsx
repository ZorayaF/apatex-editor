import React from 'react';
import { Group, Button, ActionIcon, Tooltip, Divider, Paper, Box, Text } from '@mantine/core';
import {
  IconH1,
  IconH2,
  IconTypography,
  IconQuote,
  IconFilePlus,
  IconTable,
  IconPhoto
} from '@tabler/icons-react';
import { useDocumentStore } from '@store'; // Importamos desde el index del store refactorizado

/**
 * Helper Component para botones de la barra de herramientas.
 * Garantiza consistencia en Tooltips y estados activos.
 */
const ToolbarButton = ({ label, icon: Icon, onClick, isActive, shortcut }) => (
  <Tooltip label={`${label} ${shortcut ? `(${shortcut})` : ''}`} withArrow position="bottom">
    <ActionIcon
      size="lg"
      variant={isActive ? "light" : "subtle"} // Feedback visual reactivo
      color={isActive ? "blue" : "gray"}
      onClick={onClick}
      aria-label={label}
    >
      <Icon size={20} stroke={1.5} />
    </ActionIcon>
  </Tooltip>
);

export const Header = () => {
  // 1. Suscripción a Zustand
  // Obtenemos las acciones y el estado necesario para la reactividad
  const { addBlock, addPage, selectedBlockId, blocks } = useDocumentStore();

  // 2. Lógica Reactiva Visual
  // Determinamos qué tipo de bloque está activo para iluminar el botón correspondiente
  const activeBlock = blocks.find((b) => b.id === selectedBlockId);
  const activeType = activeBlock ? activeBlock.type : null;

  return (
    <Paper
      h={60}
      px="md"
      pos="sticky"
      top={0}
      style={{ zIndex: 100, borderBottom: '1px solid var(--mantine-color-gray-3)' }}
      radius={0}
      shadow="sm"
    >
      <Group h="100%" justify="space-between">

        {/* --- CLUSTER 1: JERARQUÍA Y TEXTO (Izquierda - Primario) --- */}
        <Group gap="xs">
          <ToolbarButton
            label="Título Principal (H1)"
            icon={IconH1}
            onClick={() => addBlock('h1')}
            isActive={activeType === 'h1'}
          />
          <ToolbarButton
            label="Subtítulo (H2)"
            icon={IconH2}
            onClick={() => addBlock('h2')}
            isActive={activeType === 'h2'}
          />
          <ToolbarButton
            label="Párrafo Normal"
            icon={IconTypography}
            onClick={() => addBlock('paragraph')}
            isActive={activeType === 'paragraph'}
          />

          <Divider orientation="vertical" mx="xs" h={24} />

          <ToolbarButton
            label="Cita en Bloque"
            icon={IconQuote}
            onClick={() => addBlock('blockquote')}
            isActive={activeType === 'blockquote'}
          />
        </Group>

        {/* --- CLUSTER 2: ESTRUCTURA E INSERCIONES (Centro/Derecha) --- */}
        <Group gap="xs">
          {/* Marcadores de posición para futuras features (Tablas/Imágenes) */}
          <Group gap={4} visibleFrom="sm">
            <ToolbarButton
              label="Insertar Imagen"
              icon={IconPhoto}
              onClick={() => console.log('Feature WIP')}
              isActive={false}
            />
            <ToolbarButton
              label="Insertar Tabla"
              icon={IconTable}
              onClick={() => console.log('Feature WIP')}
              isActive={false}
            />
          </Group>

          <Divider orientation="vertical" mx="xs" h={24} />

          {/* Acción Crítica: Nueva Página */}
          <Tooltip label="Añadir Nueva Página" withArrow position="bottom">
            <Button
              leftSection={<IconFilePlus size={18} />}
              variant="default"
              size="xs"
              onClick={addPage}
            >
              Nueva Página
            </Button>
          </Tooltip>
        </Group>

      </Group>
    </Paper>
  );
};

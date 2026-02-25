// features/editor/components/header/HeaderButton.jsx
import React from 'react';
import { UnstyledButton, Text, Tooltip, Stack, rem } from '@mantine/core';

export const HeaderButton = ({
  label,        // Texto corto debajo del icono (ej: "Título 1")
  description,  // Texto del tooltip (ej: "Insertar encabezado principal")
  icon: Icon,   // El componente del icono
  onClick,
  isActive,
  color = 'blue' // Color del highlight
}) => {
  return (
    <Tooltip label={description} withArrow position="bottom" openDelay={500}>
      <UnstyledButton
        onClick={onClick}
        style={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: rem(8),
          borderRadius: theme.radius.md,
          transition: 'all 0.2s ease',
          backgroundColor: isActive
            ? 'var(--mantine-color-blue-0)' // Fondo suave si está activo
            : 'transparent',
          color: isActive
            ? 'var(--mantine-color-blue-7)'
            : 'var(--mantine-color-gray-7)',
          '&:hover': {
            backgroundColor: isActive
              ? 'var(--mantine-color-blue-1)'
              : 'var(--mantine-color-gray-1)',
          }
        })}
      >
        <Stack align="center" gap={4}>
          <Icon size={22} stroke={1.5} />
          <Text size="10px" fw={600} style={{ lineHeight: 1 }}>
            {label}
          </Text>
        </Stack>
      </UnstyledButton>
    </Tooltip>
  );
};

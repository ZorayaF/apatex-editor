import React from "react";
import {
  Box,
  Divider,
  ScrollArea,
  Stack,
  SegmentedControl,
  Group,
  Button,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import classes from "./InspectorContainer.module.css";

export const InspectorContainer = ({
  // Configuración de Cabecera (SegmentedControl)
  navSegments,
  activeSegment,
  onNavChange,

  // Contenido central
  children,

  // Configuración del Pie
  onSave,
  saveLabel = "Guardar y Cerrar",
  saveIcon = <IconCheck size={16} />,

  onDelete,
  deleteTooltip = "Eliminar elemento",

  footerContent, // Slot opcional por si se quiere un pie personalizado
}) => {
  return (
    <Box className={classes.container}>
      {/* 1. CABECERA SEGMENTADA */}
      {navSegments && (
        <Box className={classes.header}>
          <SegmentedControl
            fullWidth
            size="xs"
            radius="md"
            value={activeSegment}
            onChange={onNavChange}
            data={navSegments}
          />
          <Divider mt="xs" />
        </Box>
      )}

      {/* 2. CUERPO CON SCROLL AUTOMÁTICO */}
      <ScrollArea className={classes.scrollBody} scrollbarSize={6} type="hover">
        <Stack gap="md" className={classes.content}>
          {children}
        </Stack>
      </ScrollArea>

      {/* 3. PIE DE ACCIONES */}
      {(onSave || onDelete || footerContent) && (
        <Box className={classes.footer}>
          {footerContent ? (
            footerContent
          ) : (
            <Group gap="xs" justify="space-between">
              {onDelete && (
                <Tooltip label={deleteTooltip} withArrow position="top">
                  <ActionIcon
                    variant="light"
                    color="red"
                    size="lg"
                    radius="md"
                    onClick={onDelete}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Tooltip>
              )}

              {onSave && (
                <Button
                  style={{ flex: 1 }}
                  color="blue"
                  size="sm"
                  leftSection={saveIcon}
                  onClick={onSave}
                >
                  {saveLabel}
                </Button>
              )}
            </Group>
          )}
        </Box>
      )}
    </Box>
  );
};

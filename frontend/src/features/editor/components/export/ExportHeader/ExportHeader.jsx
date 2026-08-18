import React from "react";
import {
  Group,
  Box,
  Button,
  ActionIcon,
  Title,
  Text,
  Paper,
  Tooltip,
} from "@mantine/core";
import {
  IconFileTypePdf,
  IconEye,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from "@tabler/icons-react";
import classes from "./ExportHeader.module.css";

export const ExportHeader = ({
  isSidebarOpen,
  onToggleSidebar,
  onOpenExportModal,
  isExporting,
}) => {
  return (
    <Paper
      px="xl"
      py="sm"
      radius={0}
      bg="white"
      className={`no-print ${classes.header}`}
    >
      <Group justify="space-between" align="center">
        <Group gap="md">
          <Tooltip
            label={
              isSidebarOpen
                ? "Ocultar panel de filtros"
                : "Mostrar panel de filtros"
            }
            withArrow
          >
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={onToggleSidebar}
            >
              {isSidebarOpen ? (
                <IconLayoutSidebarLeftCollapse size={20} />
              ) : (
                <IconLayoutSidebarLeftExpand size={20} />
              )}
            </ActionIcon>
          </Tooltip>

          <div>
            <Title order={3} size="h4" fw={700} className={classes.title}>
              Previsualización
            </Title>
            <Text c="dimmed" size="xs">
              Normativa APA 7.ª edición · Universidad de Boyacá
            </Text>
          </div>
        </Group>

        <Button
          leftSection={<IconFileTypePdf size={18} />}
          color="blue"
          size="sm"
          radius="md"
          px="lg"
          className={classes.exportBtn}
          loading={isExporting}
          onClick={onOpenExportModal}
        >
          Exportar PDF
        </Button>
      </Group>
    </Paper>
  );
};

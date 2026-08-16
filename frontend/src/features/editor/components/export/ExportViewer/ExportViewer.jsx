import React from "react";
import { Box, Affix, Transition, Tooltip, ActionIcon } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import { DocumentExporter } from "../DocumentExporter/DocumentExporter";
import classes from "./ExportViewer.module.css";

export const ExportViewer = ({
  sections,
  scrollContainerRef,
  onScroll,
  showScrollTop,
  onScrollToTop,
}) => {
  return (
    <Box
      ref={scrollContainerRef}
      onScroll={onScroll}
      className={classes.viewerContainer}
    >
      <DocumentExporter sections={sections} />

      <Affix position={{ bottom: 28, right: 28 }} className="no-print">
        <Transition transition="slide-up" mounted={showScrollTop}>
          {(transitionStyles) => (
            <Tooltip label="Volver al inicio" position="left" withArrow>
              <ActionIcon
                size={44}
                radius="xl"
                color="blue"
                variant="filled"
                className={classes.fab}
                style={transitionStyles}
                onClick={onScrollToTop}
              >
                <IconArrowUp size={22} stroke={2.2} />
              </ActionIcon>
            </Tooltip>
          )}
        </Transition>
      </Affix>
    </Box>
  );
};

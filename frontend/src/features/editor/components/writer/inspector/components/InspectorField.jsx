import React from "react";
import { Box, Text } from "@mantine/core";

export const InspectorField = ({ label, children, description }) => {
  return (
    <Box
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <Text size="xs" fw={500} mb={4} c="gray.8">
        {label}
      </Text>
      <Box style={{ width: "100%", maxWidth: "100%", minWidth: 0 }}>
        {children}
      </Box>
      {description && (
        <Text size="xs" c="dimmed" mt={4} style={{ wordBreak: "break-word" }}>
          {description}
        </Text>
      )}
    </Box>
  );
};

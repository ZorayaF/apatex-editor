import React from "react";
import { Box, Text } from "@mantine/core";

export const InspectorField = ({ label, children, description }) => {
  return (
    <Box mb="md">
      <Text size="sm" fw={500} mb={4}>
        {label}
      </Text>
      {children}
      {description && (
        <Text size="xs" c="dimmed" mt={4}>
          {description}
        </Text>
      )}
    </Box>
  );
};

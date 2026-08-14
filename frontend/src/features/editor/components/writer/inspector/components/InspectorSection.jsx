import React from "react";
import { Box, Text, Divider, Stack } from "@mantine/core";

export const InspectorSection = ({ title, children }) => {
  return (
    <Box mb="xl">
      <Text size="xs" fw={700} c="blue.7" tt="uppercase" mb="xs">
        {title}
      </Text>
      <Divider mb="md" />
      <Stack gap="xs">{children}</Stack>
    </Box>
  );
};

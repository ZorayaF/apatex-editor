// src/features/editor/components/blocks/BaseEditable.jsx
import React from 'react';
import { Textarea } from '@mantine/core';
import { useDocumentStore } from '@store';

export const BaseEditable = ({ id, content, styles }) => {
  const updateBlock = useDocumentStore((state) => state.updateBlock);
  const setSelectedBlockId = useDocumentStore((state) => state.setSelectedBlockId);

  return (
    <Textarea
      value={content}
      onChange={(e) => updateBlock(id, e.currentTarget.value)}
      onFocus={() => setSelectedBlockId(id)}
      autosize
      minRows={1}
      variant="unstyled"
      styles={{
        input: {
          padding: 0,
          backgroundColor: 'transparent',
          width: '100%',
          resize: 'none',
          ...styles, // Aquí inyectamos la personalidad (Título o Párrafo)
        },
      }}
    />
  );
};

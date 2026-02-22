// src/features/editor/components/canvas/EditableBlock.jsx
import React from 'react';
import { Textarea } from '@mantine/core';
import { useDocumentStore } from '@store/useDocumentStore';
import { cmToPx, ptToPx, APA_CONFIG } from '@core/utils/measurements';

export const EditableBlock = ({ id, content, type }) => {
  const updateBlock = useDocumentStore((state) => state.updateBlock);
  const setSelectedBlockId = useDocumentStore((state) => state.setSelectedBlockId);

  const { typography } = APA_CONFIG;
  const isParagraph = type === 'paragraph';

  return (
    <Textarea
      value={content}
      onChange={(e) => updateBlock(id, e.currentTarget.value)}
      onFocus={() => {
        console.log("Foco detectado en:", id); // Mira si esto sale en la consola normal
        setSelectedBlockId(id);
      }} autosize
      minRows={1}
      variant="unstyled"
      styles={{
        input: {
          padding: 0,
          fontFamily: typography.family,
          fontSize: `${ptToPx(typography.size)}px`,
          lineHeight: typography.lineHeight,
          textAlign: isParagraph ? 'justify' : 'center',
          textIndent: isParagraph ? `${cmToPx(typography.indent)}px` : '0',
          color: 'black',
          width: '100%',
          backgroundColor: 'transparent', // ¡CRÍTICO!
          border: 'none'
        },
      }}
    />
  );
};

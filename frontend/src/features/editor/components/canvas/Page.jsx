// frontend/src/features/editor/components/canvas/Page.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Paper, Box, Badge } from '@mantine/core';
import { cmToPx, ptToPx, APA_CONFIG, getPageHeightPx, getAvailableHeightPx } from '@core/utils/measurements';

export const Page = ({ children, pageNumber }) => {
  const contentRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const { paper, margins, typography } = APA_CONFIG;

  // Lógica de detección de desbordamiento
  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const maxHeight = getAvailableHeightPx();

      setIsOverflowing(contentHeight > maxHeight);
    }
  }, [children]); // Se ejecuta cada vez que el contenido cambia

  return (
    <Paper
      shadow="md"
      radius={0}
      mb={30}
      style={{
        width: cmToPx(paper.width),
        height: getPageHeightPx(),
        padding: `${cmToPx(margins.top)}px ${cmToPx(margins.right)}px ${cmToPx(margins.bottom)}px ${cmToPx(margins.left)}px`,
        margin: '20px auto',
        position: 'relative',
        backgroundColor: 'white',
        fontFamily: typography.family,
        fontSize: `${ptToPx(typography.size)}px`,
        outline: isOverflowing ? '2px solid #fa5252' : 'none', // Borde rojo si desborda
        transition: 'outline 0.2s ease'
      }}
    >
      {/* Alerta de Desbordamiento */}
      {isOverflowing && (
        <Badge
          color="red"
          variant="filled"
          style={{ position: 'absolute', top: -10, right: -10, zIndex: 10 }}
        >
          ¡Contenido excede la página!
        </Badge>
      )}

      {/* Indicador de página */}
      <Box style={{ position: 'absolute', bottom: 10, right: 20, fontSize: '10pt', color: '#adb5bd' }}>
        Página {pageNumber}
      </Box>

      {/* Contenedor medible del contenido */}
      <Box ref={contentRef} style={{ height: '100%' }}>
        {children}
      </Box>
    </Paper>
  );
};

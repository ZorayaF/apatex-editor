// src/features/editor/components/canvas/Page.jsx
import { Paper, Box } from '@mantine/core';
import { PAGE_WIDTH_PX, PAGE_HEIGHT_PX, cmToPx, APA_CONFIG } from '@core/utils/measurements';

export const Page = ({ children, pageNumber }) => {
  const { margins } = APA_CONFIG;

  return (
    <Paper
      shadow="md"
      radius={0}
      style={{
        // MEDIDAS CONSTANTES
        width: `${PAGE_WIDTH_PX}px`,
        height: `${PAGE_HEIGHT_PX}px`,
        minHeight: `${PAGE_HEIGHT_PX}px`,
        maxHeight: `${PAGE_HEIGHT_PX}px`,

        // MÁRGENES
        paddingTop: `${cmToPx(margins.top)}px`,
        paddingBottom: `${cmToPx(margins.bottom)}px`,
        paddingLeft: `${cmToPx(margins.left)}px`,
        paddingRight: `${cmToPx(margins.right)}px`,

        // IMPORTANTE: El padding no afecta al width/height total
        boxSizing: 'border-box',

        backgroundColor: 'white',
        position: 'relative',
        overflow: 'hidden', // No dejamos que nada salga de la hoja física
        margin: '20px auto', // Espaciado entre hojas en el fondo gris
      }}
    >
      <Box style={{ height: '100%', position: 'relative' }}>
        {children}
      </Box>

      {/* Indicador de página (opcional) */}
      <Box style={{ position: 'absolute', bottom: 20, right: 40, fontSize: '10pt' }}>
        {pageNumber}
      </Box>
    </Paper>
  );
};

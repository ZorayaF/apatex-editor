// src/features/editor/components/canvas/Page.jsx
import { Paper, Box } from '@mantine/core';
import { PAGE_WIDTH_PX, PAGE_HEIGHT_PX, cmToPx, APA_CONFIG } from '@core/utils/measurements';
import { useStore } from '@store';

export const Page = ({ children, pageNumber }) => {
  const { margins } = APA_CONFIG;

  // 1. Suscribirse al índice de la página activa
  const activePageIndex = useStore((state) => state.activePageIndex);
  const setActivePage = useStore((state) => state.setActivePage);
  const setSelectedBlockId = useStore((state) => state.setSelectedBlockId);

  // Comprobar si ESTA página es la activa
  const isActive = activePageIndex === (pageNumber - 1);

  const handlePageClick = (e) => {
    // Si haces clic directamente en el papel blanco
    if (e.target === e.currentTarget) {
      setActivePage(pageNumber - 1); // Activar esta página
      setSelectedBlockId(null);       // Limpiar selección de bloques
    }
  };

  return (
    <Paper
      shadow={isActive ? "xl" : "md"} // Sombra más profunda si está activa
      radius={0}
      onClick={handlePageClick}
      style={{
        width: `${PAGE_WIDTH_PX}px`,
        height: `${PAGE_HEIGHT_PX}px`,
        minHeight: `${PAGE_HEIGHT_PX}px`,
        maxHeight: `${PAGE_HEIGHT_PX}px`,
        paddingTop: `${cmToPx(margins.top)}px`,
        paddingBottom: `${cmToPx(margins.bottom)}px`,
        paddingLeft: `${cmToPx(margins.left)}px`,
        paddingRight: `${cmToPx(margins.right)}px`,
        boxSizing: 'border-box',
        backgroundColor: 'white',
        position: 'relative',
        overflow: 'hidden',
        margin: '20px auto',
        transition: 'all 0.2s ease', // Suaviza el cambio de sombra/borde

        // 2. EFECTO VISUAL: Un borde azul muy sutil por fuera
        outline: isActive ? '2px solid #228be6' : '1px solid #e0e0e0',
        // Si no está activa, el borde es gris casi invisible
      }}
    >
      {/* Contenedor interno para asegurar que el clic llegue al Paper */}
      <Box style={{ height: '100%', position: 'relative', pointerEvents: 'none' }}>
        {/* Usamos pointerEvents: 'none' en el Box contenedor para que el clic 
            atraviese los espacios vacíos y llegue al Paper */}
        <div style={{ pointerEvents: 'auto' }}>
          {children}
        </div>
      </Box>

      <Box style={{
        position: 'absolute',
        bottom: 20,
        right: 40,
        fontSize: '10pt',
        color: isActive ? '#228be6' : '#ccc', // El número de página se ilumina
        fontWeight: isActive ? 'bold' : 'normal'
      }}>
        {pageNumber}
      </Box>
    </Paper>
  );
};

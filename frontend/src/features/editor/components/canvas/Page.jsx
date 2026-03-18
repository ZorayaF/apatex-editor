import { useEffect, useRef } from 'react';
import { Paper, Box } from '@mantine/core';
import {
  PAGE_WIDTH_PX,
  PAGE_HEIGHT_PX,
  cmToPx,
  APA_CONFIG,
} from '@core/utils/measurements';
import { useStore } from '@store';
import { getOverflowBlockId } from '../../logic/engine/paginationEngine';

export const Page = ({ children, pageNumber }) => {
  const { margins } = APA_CONFIG;
  const pageContentRef = useRef(null);

  // Acciones y estado del Store
  const activePageIndex = useStore((state) => state.activePageIndex);
  const setActivePage = useStore((state) => state.setActivePage);
  const setSelectedBlockId = useStore((state) => state.setSelectedBlockId);
  const moveToNextPage = useStore((state) => state.moveToNextPage);
  const blocks = useStore((state) => state.blocks);

  const isActive = activePageIndex === (pageNumber - 1);

  /**
   * EFECTO DE PAGINACIÓN (PUSH ONLY)
   * Se dispara cuando cambian los bloques para verificar si alguno 
   * sobrepasa el margen inferior de 2.54cm.
   */
  useEffect(() => {
    if (pageContentRef.current) {
      const overflowId = getOverflowBlockId(pageContentRef.current);

      if (overflowId) {
        moveToNextPage(overflowId);
      }
    }
  }, [children, blocks]); // Reacciona al contenido y a la estructura

  const handlePageClick = (e) => {
    // Si haces clic directamente en la hoja (no en un bloque)
    if (e.target === e.currentTarget) {
      setActivePage(pageNumber - 1);
      setSelectedBlockId(null);
    }
  };

  return (
    <Paper
      shadow={isActive ? "xl" : "md"}
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
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        outline: isActive ? '2px solid #228be6' : '1px solid #e0e0e0',
      }}
    >
      {/* Contenedor de contenido útil */}
      <Box
        ref={pageContentRef}
        style={{ height: '100%', position: 'relative', pointerEvents: 'none' }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          {children}
        </div>
      </Box>

      {/* Indicador de número de página */}
      <Box style={{
        position: 'absolute',
        bottom: 20,
        right: 40,
        fontSize: '10pt',
        color: isActive ? '#228be6' : '#ccc',
        fontWeight: isActive ? 'bold' : 'normal',
        userSelect: 'none'
      }}>
        {pageNumber}
      </Box>
    </Paper>
  );
};

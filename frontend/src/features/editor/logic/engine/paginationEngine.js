import { CONTENT_MAX_HEIGHT } from '@core/utils/measurements';

/**
 * Identifica el primer bloque que supera el límite de altura de la página.
 * @param {HTMLElement} pageContentElement - El contenedor 'Box' que envuelve los bloques.
 * @returns {string|null} - El ID del bloque desbordado o null si todo cabe.
 */
export const getOverflowBlockId = (pageContentElement) => {
  // Buscamos todos los elementos que representen un bloque (BlockWrapper)
  const blocks = pageContentElement.querySelectorAll('[data-block-id]');

  for (const block of blocks) {
    /**
     * offsetTop: Distancia desde el inicio del contenedor (Padding Top incluido).
     * offsetHeight: Altura total del bloque (incluyendo interlineado y padding).
     */
    const blockBottom = block.offsetTop + block.offsetHeight;

    // Si el final del bloque cruza el límite de los ~864px (margen inferior APA)
    if (blockBottom > CONTENT_MAX_HEIGHT) {
      return block.getAttribute('data-block-id');
    }
  }

  return null;
};

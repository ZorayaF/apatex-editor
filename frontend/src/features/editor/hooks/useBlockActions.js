import { useDocStore } from '../../../store/useDocStore.js'; // Ajusta la ruta si es necesario

import { splitBlockLogic, mergeBlocksLogic } from '../../../store/docUtils'; // Asegúrate de tener docUtils

export function useBlockActions() {
  const { blocks, setBlocks, updateBlock } = useDocStore();

  // Función para manejar el ENTER
  const handleEnter = (id, cursorPosition) => {
    // 1. Calculamos los nuevos bloques usando la lógica pura
    const newBlocks = splitBlockLogic(blocks, id, cursorPosition);

    // 2. Guardamos en el store
    setBlocks(newBlocks);

    // 3. Enfocamos el nuevo bloque (el que se creó abajo)
    // El nuevo bloque es el que sigue al actual en la lista
    const currentIndex = blocks.findIndex(b => b.id === id);
    // Necesitamos esperar a que React renderice el nuevo bloque
    setTimeout(() => {
      // El ID del nuevo bloque lo generamos en splitBlockLogic con Date.now()
      // Como es difícil predecir el ID exacto aquí sin retornar, 
      // un truco es buscar el input que esté en la posición index + 1
      const inputs = document.querySelectorAll('textarea');
      if (inputs[currentIndex + 1]) {
        inputs[currentIndex + 1].focus();
      }
    }, 0);
  };

  // Función para manejar el BORRAR (Backspace)
  const handleBackspace = (id) => {
    const { newBlocks, targetCursor, targetBlockId } = mergeBlocksLogic(blocks, id);

    if (targetBlockId) {
      setBlocks(newBlocks);

      // Esperamos un "tick" para mover el cursor al bloque de arriba
      setTimeout(() => {
        const element = document.getElementById(`input-${targetBlockId}`);
        if (element) {
          element.focus();
          element.setSelectionRange(targetCursor, targetCursor);
        }
      }, 0);
    }
  };

  const handleDelete = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  return {
    handleEnter,
    handleBackspace,
    handleDelete,
    updateBlockContent: updateBlock // Alias para mantener nombres claros
  };
}

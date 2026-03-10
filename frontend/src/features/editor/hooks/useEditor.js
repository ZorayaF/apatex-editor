// features/editor/hooks/useEditor.js

export const useEditor = () => {
  const store = useStore(); // Zustand

  const handleInsertBlock = (type) => {
    // 1. Pedir al Motor de Inserción que calcule el nuevo estado
    const { updatedPages, targetPage } = calculateInsertion(
      store.pages,
      store.blocks,
      type,
      store.activePageIndex
    );

    // 2. Ejecutar el cambio en el store
    store.updateEditorState(updatedPages, targetPage);
  };

  return {
    insertBlock: handleInsertBlock,
    // ... otras funciones como deleteBlock, moveBlock
  };
};

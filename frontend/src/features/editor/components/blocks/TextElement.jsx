import { Textarea } from '@mantine/core';
import { useBlockActions } from '../../hooks/useBlockActions'; // Asegúrate que esta ruta sea correcta para tu estructura

export function TextElement({ block }) {
  const { handleEnter, handleBackspace, updateBlockContent } = useBlockActions();

  // Definimos estilos dinámicos según el tipo de bloque (APA)
  const isH1 = block.type === 'h1';

  const getStyles = () => ({
    input: {
      fontFamily: 'Times New Roman, serif',
      fontSize: '12pt',
      lineHeight: '1.5',
      padding: 0,
      overflow: 'hidden',

      // ELIMINADO: minHeight: 'unset' (Esto causaba el error)

      // Diferencias entre H1 y Párrafo
      fontWeight: isH1 ? 'bold' : 'normal',
      textAlign: isH1 ? 'center' : 'justify',
      textTransform: isH1 ? 'uppercase' : 'none',
      textIndent: !isH1 ? '1.27cm' : '0',
      marginBottom: isH1 ? '1em' : '0',
    }
  });

  const handleKeyDown = (e) => {
    // ENTER: Crear nuevo bloque
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnter(block.id, e.target.selectionStart);
    }

    // BACKSPACE: Borrar o unir bloques
    if (e.key === 'Backspace' && e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
      // Pasamos el evento para que el hook decida (opcional, pero buena práctica)
      handleBackspace(block.id);
    }
  };

  return (
    <Textarea
      id={`input-${block.id}`}
      variant="unstyled"
      autosize
      minRows={1} // <--- AÑADIDO: Esta es la forma correcta de controlar la altura mínima
      value={block.content}
      onChange={(e) => updateBlockContent(block.id, e.target.value)}
      onKeyDown={handleKeyDown}
      styles={getStyles()}
      placeholder={isH1 ? "TÍTULO..." : "Escribe aquí..."}
    />
  );
}

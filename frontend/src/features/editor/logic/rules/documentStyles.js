// src/features/editor/logic/rules/documentStyles.js

export const DOCUMENT_THEME = {
  // Configuración Global del Lienzo
  global: {
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: '12pt',
    color: '#000000',
  },

  // Estilos por tipo de bloque
  blocks: {
    paragraph: {
      lineHeight: '1.5',
      textAlign: 'justify',
      textIndent: '1.27cm', // Sangría de primera línea
      marginBottom: '1em',
    },
    h1: {
      textAlign: 'center',
      fontWeight: 'bold',
      textTransform: 'capitalize', // Mayúscula Inicial
      marginTop: '0',              // El salto de página lo maneja el motor
      marginBottom: '0.5em',
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5ch',                // Espacio para la numeración
    }
  }
};

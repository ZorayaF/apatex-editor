// features/editor/logic/rules/documentStyles.js

export const DOCUMENT_THEME = {
  global: {
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: '12pt',
    color: '#000',
  },
  blocks: {
    paragraph: {
      lineHeight: '1.5',
      textAlign: 'justify',
      textIndent: '1.27cm', // La famosa sangría APA
      marginBottom: '0',    // Los párrafos suelen ir pegados en manuscritos
      padding: '2px 0',
    },
    h1: {
      textAlign: 'center',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      textIndent: '0',      // Los títulos no llevan sangría
      marginTop: '12pt',
      marginBottom: '12pt',
    }
  }
};

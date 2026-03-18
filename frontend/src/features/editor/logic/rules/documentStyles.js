import { APA_CONFIG } from "@core/utils/measurements";

export const DOCUMENT_THEME = {
  global: {
    fontFamily: APA_CONFIG.typography.family,
    fontSize: `${APA_CONFIG.typography.size}pt`,
    color: "#000",
    lineHeight: APA_CONFIG.typography.lineHeight, // 1.5 de interlineado global
  },
  blocks: {
    paragraph: {
      textAlign: "justify",
      textIndent: "1.27cm", // Sangría de primera línea APA
      marginBottom: "0",
      padding: "2px 0",
      display: "block",
    },
    h1: {
      textAlign: "center",
      fontWeight: "bold",
      textIndent: "0", // Los títulos no llevan sangría
      marginTop: "12pt",
      marginBottom: "12pt",
      display: "block",
      // Forzamos minúsculas para que el CSS controle la capitalización
    },
    h2: {
      textAlign: "left",
      fontWeight: "bold",
      marginTop: "10pt",
      marginBottom: "10pt",
    },
    h3: {
      textAlign: "left", // Alineado a la izquierda
      fontWeight: "bold", // Negrita
      fontStyle: "italic", // CURSIVA (La diferencia clave)
      marginTop: "8pt",
      marginBottom: "8pt",
      display: "block",
    },
  },
};

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
    h4: {
      textAlign: "left",
      textIndent: "1.27cm", // Sangría APA
      marginTop: "10pt",
      marginBottom: "10pt",
      display: "block",
      fontWeight: "normal", // El contenedor es normal, la negrita la pondrá el JS
    },
    h5: {
      textAlign: "left",
      textIndent: "1.27cm",
      marginTop: "10pt",
      marginBottom: "10pt",
      display: "block",
      fontWeight: "normal",
    },
    bullet: {
      paddingLeft: "1.27cm", // Alineado con la sangría normal
      textAlign: "left",
      display: "flex", // Para que la viñeta y el texto convivan
    },
  },
};

// src/features/editor/logic/rules/documentStyles.js
import { APA_CONFIG } from "@core/utils/measurements";

const { typography } = APA_CONFIG;

export const DOCUMENT_THEME = {
  global: {
    fontFamily: typography.family,
    fontSize: `${typography.size}pt`,
    lineHeight: typography.lineHeight, // 1.5
    color: "#000",
  },
  blocks: {
    // REGLA DE ORO: Margins y Paddings en 0 para que mande el line-height
    paragraph: {
      textAlign: "justify",
      textIndent: `${typography.indent}cm`, // 1.27cm
      margin: "0",
      padding: "0",
    },
    h1: {
      textAlign: "center",
      fontWeight: "bold",
      textIndent: "0",
      margin: "0", // Eliminamos los 12pt previos
    },
    h2: {
      textAlign: "left",
      fontWeight: "bold",
      textIndent: "0",
      margin: "0", // Eliminamos los 10pt previos
    },
    h3: {
      textAlign: "left",
      fontWeight: "bold",
      fontStyle: "italic",
      textIndent: "0",
      margin: "0",
    },
    h4: {
      textAlign: "left",
      textIndent: `${typography.indent}cm`,
      fontWeight: "normal", // El CSS del wrapper o JS pondrá la negrita
      margin: "0",
    },
    h5: {
      textAlign: "left",
      textIndent: `${typography.indent}cm`,
      fontWeight: "normal",
      margin: "0",
    },
    bullet: {
      paddingLeft: `${typography.indent}cm`, // Alineado con la sangría
      textAlign: "left",
      display: "flex",
      margin: "0",
    },
  },
};

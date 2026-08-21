import React from "react";

/**
 * Formatea automáticamente el pie de tabla/figura/anexo:
 * - "Nota: ..." o "Nota. ..." -> <em>Nota.</em> resto del texto
 * - "Fuente: ..." -> Fuente: resto del texto (normal)
 */
export const renderApaNote = (rawNote) => {
  if (!rawNote || typeof rawNote !== "string" || !rawNote.trim()) return null;

  const trimmed = rawNote.trim();

  // Detecta si comienza con "Nota.", "Nota:", "Note.", "Note:" (insensible a mayúsculas)
  const matchNota = trimmed.match(/^(nota|note)[\.:\s]\s*(.*)$/i);

  if (matchNota) {
    const prefix = matchNota[1]; // "Nota" o "Note"
    const rest = matchNota[2];
    return (
      <>
        <em style={{ fontStyle: "italic" }}>{prefix}.</em>
        {rest ? ` ${rest}` : ""}
      </>
    );
  }

  // Si es "Fuente:", "Adaptado de:" u otro texto, se renderiza normal
  return trimmed;
};

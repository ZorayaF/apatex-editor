// src/features/editor/components/config/preview/GlossaryPagePreview/GlossaryPagePreview.jsx
import React from "react";
import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./GlossaryPagePreview.module.css";

export const GlossaryPagePreview = ({ terms = [], metadata, pageNumber }) => {
  const finalPageNumber = pageNumber || metadata?._docMap?.glosario || "G";

  // 1. Orden alfabético
  const sortedTerms = [...(terms || [])].sort((a, b) =>
    (a?.term || "").localeCompare(b?.term || ""),
  );

  // Helper para mayúscula inicial en término
  const formatTerm = (str) => {
    if (!str) return "";
    const trimmed = str.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  };

  // Helper para minúscula inicial en definición
  const formatDef = (str) => {
    if (!str) return "";
    const trimmed = str.trim();
    return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
  };

  return (
    <PageLayout metadata={metadata} pageNumber={finalPageNumber}>
      {/* Título Centrado en Negrita */}
      <h1 className={classes.glossaryTitle}>Glosario</h1>

      {/* Contenedor sin flex vertical para respetar el flujo nativo de párrafos */}
      <div style={{ width: "100%", display: "block" }}>
        {sortedTerms.length === 0 ? (
          <p className={classes.emptyNotice}>
            No hay términos definidos en el glosario.
          </p>
        ) : (
          sortedTerms.map((item, index) => (
            <p key={item?.id || index} className={classes.termDefinitionBlock}>
              {/* Término: Mayúscula inicial, Cursiva, Negrilla y seguido de dos puntos */}
              <strong className={classes.termLabel}>
                <em>{formatTerm(item?.term)}:</em>
              </strong>{" "}
              {/* Definición: Inicia con minúscula y resto normal */}
              <span>{formatDef(item?.definition)}</span>
            </p>
          ))
        )}
      </div>
    </PageLayout>
  );
};

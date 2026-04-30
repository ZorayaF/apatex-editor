// src/features/editor/logic/engine/documentLayoutEngine.js

export const calculateDocumentMap = (metadata) => {
  const prelim = metadata?.preliminares || {};
  let current = 1;

  const map = {
    portada: current++,
    contraportada: current++,
  };

  if (prelim.aceptacion?.enabled) map.aceptacion = current++;
  if (prelim.reglamento?.enabled) map.reglamento = current++; // <-- NUEVO
  if (prelim.dedicatoria?.enabled) map.dedicatoria = current++; // <-- NUEVO
  if (prelim.agradecimientos?.enabled) map.agradecimientos = current++; // <-- NUEVO

  map.indice = current++;

  if (prelim.glosario?.enabled) map.glosario = current++; // <-- NUEVO
  map.resumen = current++;
  map.abstract = current++;

  map.editorStartPage = current;
  return map;
};

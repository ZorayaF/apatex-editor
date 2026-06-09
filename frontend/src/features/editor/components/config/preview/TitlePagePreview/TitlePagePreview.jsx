import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./TitlePagePreview.module.css";

// 1. Añadimos pageNumber a los props
export const TitlePagePreview = ({
  isContraportada,
  data,
  metadata,
  pageNumber,
}) => {
  // 2. LÓGICA INTELIGENTE: Si recibe un número lo usa, si no, es la página 1 por defecto.
  const finalPageNumber = pageNumber || 1;

  // EL CAMBIO CRÍTICO: Ahora leemos el título directamente desde la raíz
  const titulo = data?.tituloProyecto || "Título del proyecto";

  const institucion = data?.institucion || "Universidad de Boyacá";
  const facultad = data?.facultad || "Facultad de Ciencias e Ingeniería";
  const programa = data?.programa || "Programa académico";
  const ubicacion = data?.ubicacion || "Tunja";
  const anio = data?.anio || "2026";

  // Formateo de Directores (Nombre + Grado Académico)
  const directorNombre = data?.director?.nombre;
  const directorGrado = data?.director?.titulo;
  const directorCompleto = directorNombre
    ? `${directorGrado ? directorGrado + ". " : ""}${directorNombre}`
    : "Nombre del director";

  // Formateo de Autores (Mapeando saltos de línea de forma nativa)
  const listaAutores =
    Array.isArray(data?.autores) && data.autores.length > 0
      ? data.autores.join("\n")
      : "Nombre del autor";

  return (
    // 3. Pasamos el finalPageNumber al PageLayout
    <PageLayout
      metadata={metadata}
      hideHeader={true}
      pageNumber={finalPageNumber}
    >
      <div className={classes.titlePageContainer}>
        {/* 1. TÍTULO DEL PROYECTO (BLOQUE SUPERIOR) */}
        <h1 className={classes.projectTitle}>{titulo}</h1>

        {/* 2. BLOQUE CENTRAL: AUTORES Y OBJETIVO INSTITUCIONAL */}
        <div className={classes.centerBlock}>
          <p className={classes.authorsText}>{listaAutores}</p>

          {isContraportada && (
            <div className={classes.targetDegreeBox}>
              <p className={classes.targetDegreeText}>
                Trabajo de grado para optar al título de
              </p>
              <p className={classes.targetDegreeText}>
                {data?.gradoObjetivo ||
                  "Título al que opta (Ej: Ingeniero de Sistemas)"}
              </p>

              <div className={classes.directorBox}>
                <p className={classes.directorText}>Director:</p>
                <p className={classes.directorText}>{directorCompleto}</p>
              </div>
            </div>
          )}
        </div>

        {/* 3. BLOQUE INFERIOR: INSTITUCIÓN, FACULTAD, PROGRAMA, UBICACIÓN Y AÑO */}
        <div className={classes.institutionalFooter}>
          <p className={classes.footerLine}>{institucion}</p>
          <p className={classes.footerLine}>{facultad}</p>
          <p className={classes.footerLine}>{programa}</p>
          <p className={classes.footerLine}>{ubicacion}</p>
          <p className={classes.footerLine}>{anio}</p>
        </div>
      </div>
    </PageLayout>
  );
};

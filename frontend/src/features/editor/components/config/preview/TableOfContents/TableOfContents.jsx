import { Stack, Divider } from "@mantine/core";
import { useStore } from "@store";
import { generateAllLists } from "@logic/engine/tocEngine";
import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./TableOfContents.module.css";

// 1. RECIBIMOS startPage DESDE EL EXPORTADOR
export const TableOfContents = ({ startPage }) => {
  const { blocks, pages, projectMetadata } = useStore();

  const allLists = generateAllLists(blocks, pages, projectMetadata);

  // Mapeo exacto de sangrías en píxeles según el nivel tipográfico estructural de la APA 7
  const getIndentPixels = (level) => {
    if (level === "h2") return "20px";
    if (level === "h3") return "40px";
    return "0px";
  };

  // 2. LÓGICA INTELIGENTE EN CASCADA:
  // Si tenemos 'startPage' (modo exportación), incrementamos el número por cada lista.
  // Si no, caemos en la configuración romana por defecto del docMap.
  let currentExportPage = startPage;
  const docIndices = projectMetadata?._docMap?.indices || {};

  const tocPages = {
    contenido: currentExportPage
      ? currentExportPage++
      : docIndices.contenido || "v",
    tablas: currentExportPage ? currentExportPage++ : docIndices.tablas || "vi",
    figuras: currentExportPage
      ? currentExportPage++
      : docIndices.figuras || "vii",
    anexos: currentExportPage
      ? currentExportPage++
      : docIndices.anexos || "viii",
  };

  // Sub-componente interno atómico para renderizar las filas con relleno de puntos nativo
  const ListRow = ({ text, page, level }) => (
    <div
      className={classes.tocRow}
      style={{ paddingLeft: getIndentPixels(level) }}
    >
      <p className={classes.tocText}>{text}</p>
      <div className={classes.dotLeader} />
      <p className={classes.tocPageNumber}>{page}</p>
    </div>
  );

  return (
    <Stack gap="xl">
      {/* 📜 ÍNDICE 1: CONTENIDO GENERAL (SIEMPRE VISIBLE) */}
      <div id="toc-sheet-contenido">
        <PageLayout metadata={projectMetadata} pageNumber={tocPages.contenido}>
          <h1 className={classes.listTitle}>Contenido</h1>
          <div className={classes.pageIndicatorGroup}>
            <p className={classes.pageIndicatorText}>Pág.</p>
          </div>

          <Stack gap="xs" style={{ flex: 1 }}>
            {allLists.contenido.map((entry, index) => (
              <ListRow
                key={index}
                text={entry.text}
                page={entry.page}
                level={entry.level}
              />
            ))}
            {allLists.contenido.length === 0 && (
              <p className={classes.emptyNotice}>
                Los títulos aparecerán aquí automáticamente a medida que
                redactes en el canvas.
              </p>
            )}
          </Stack>
        </PageLayout>
      </div>

      {/* 📊 ÍNDICE 2: LISTA DE TABLAS (CONDICIONAL) */}
      {allLists.tablas.length > 0 && (
        <div id="toc-sheet-tablas">
          <Divider
            label="Salto de página hacia Lista de Tablas"
            labelPosition="center"
            color="gray.4"
            mb="xl"
            className="no-print"
          />
          <PageLayout metadata={projectMetadata} pageNumber={tocPages.tablas}>
            <h1 className={classes.listTitle}>Lista de Tablas</h1>
            <div className={classes.pageIndicatorGroup}>
              <p className={classes.pageIndicatorText}>Pág.</p>
            </div>

            <Stack gap="xs" style={{ flex: 1 }}>
              {allLists.tablas.map((table, index) => (
                <ListRow
                  key={index}
                  text={`${table.label}. ${table.title}`}
                  page={table.page}
                />
              ))}
            </Stack>
          </PageLayout>
        </div>
      )}

      {/* 🖼️ ÍNDICE 3: LISTA DE FIGURAS (CONDICIONAL) */}
      {allLists.figuras.length > 0 && (
        <div id="toc-sheet-figuras">
          <Divider
            label="Salto de página hacia Lista de Figuras"
            labelPosition="center"
            color="gray.4"
            mb="xl"
            className="no-print"
          />
          <PageLayout metadata={projectMetadata} pageNumber={tocPages.figuras}>
            <h1 className={classes.listTitle}>Lista de Figuras</h1>
            <div className={classes.pageIndicatorGroup}>
              <p className={classes.pageIndicatorText}>Pág.</p>
            </div>

            <Stack gap="xs" style={{ flex: 1 }}>
              {allLists.figuras.map((fig, index) => (
                <ListRow
                  key={index}
                  text={`${fig.label}. ${fig.title}`}
                  page={fig.page}
                />
              ))}
            </Stack>
          </PageLayout>
        </div>
      )}

      {/* 📎 ÍNDICE 4: LISTA DE ANEXOS (CONDICIONAL) */}
      {allLists.anexos.length > 0 && (
        <div id="toc-sheet-anexos">
          <Divider
            label="Salto de página hacia Lista de Anexos"
            labelPosition="center"
            color="gray.4"
            mb="xl"
            className="no-print"
          />
          <PageLayout metadata={projectMetadata} pageNumber={tocPages.anexos}>
            <h1 className={classes.listTitle}>Lista de Anexos</h1>
            <div className={classes.pageIndicatorGroup}>
              <p className={classes.pageIndicatorText}>Pág.</p>
            </div>

            <Stack gap="xs" style={{ flex: 1 }}>
              {allLists.anexos.map((anexo, index) => (
                <ListRow
                  key={index}
                  text={`${anexo.label}. ${anexo.title}`}
                  page={anexo.page}
                />
              ))}
            </Stack>
          </PageLayout>
        </div>
      )}
    </Stack>
  );
};

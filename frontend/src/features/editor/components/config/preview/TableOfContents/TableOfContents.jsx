// src/features/editor/components/config/preview/TableOfContents/TableOfContents.jsx
import React from "react";
import { Stack, Divider } from "@mantine/core";
import { useStore } from "@store";
import { buildDocumentPages } from "@logic/engine/document/buildDocumentPages";
import { getTocEntries } from "@logic/engine/document/getTocEntries";
import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./TableOfContents.module.css";

export const TableOfContents = ({ sections = {} }) => {
  const { blocks, pages, projectMetadata, sources } = useStore();

  // 1. Resolvemos el mapa plano de hojas reales
  const docPages = buildDocumentPages({
    projectMetadata,
    canvasPages: pages,
    blocks,
    sources,
    activeSections: sections,
  });

  // 2. Extraemos las entradas con sus números de página exactos
  const lists = getTocEntries(docPages, blocks);

  // 3. Localizamos los números de página físicos para cada tipo de TOC
  const tocContentPage =
    docPages.find((p) => p.type === "toc_contenido")?.pageNumber || 1;
  const tocTablesPage = docPages.find(
    (p) => p.type === "toc_tablas",
  )?.pageNumber;
  const tocFiguresPage = docPages.find(
    (p) => p.type === "toc_figuras",
  )?.pageNumber;
  const tocAnnexesPage = docPages.find(
    (p) => p.type === "toc_anexos",
  )?.pageNumber;

  const getIndentPixels = (level) => {
    if (level === "h2") return "20px";
    if (level === "h3") return "40px";
    return "0px";
  };

  const ListRow = ({ text, page, level, blockId }) => (
    <a
      href={blockId ? `#${blockId}` : undefined}
      className={classes.tocRow}
      style={{
        paddingLeft: getIndentPixels(level),
        textDecoration: "none",
        color: "inherit",
        cursor: blockId ? "pointer" : "default",
        display: "flex",
      }}
    >
      <p className={classes.tocText}>{text}</p>
      <div className={classes.dotLeader} />
      <p className={classes.tocPageNumber}>{page}</p>
    </a>
  );

  return (
    <>
      {/* 📜 ÍNDICE 1: CONTENIDO GENERAL */}
      <div id="toc-sheet-contenido">
        <PageLayout metadata={projectMetadata} pageNumber={tocContentPage}>
          <h1 className={classes.listTitle}>Contenido</h1>
          <div className={classes.pageIndicatorGroup}>
            <p className={classes.pageIndicatorText}>Pág.</p>
          </div>

          <Stack gap="xs" style={{ flex: 1 }}>
            {lists.contenido.map((entry, index) => (
              <ListRow
                key={index}
                text={entry.text}
                page={entry.page}
                level={entry.level}
                blockId={entry.id}
              />
            ))}

            {lists.contenido.length === 0 && (
              <p className={classes.emptyNotice}>
                Los títulos aparecerán aquí automáticamente a medida que
                redactes en el canvas.
              </p>
            )}
          </Stack>
        </PageLayout>
      </div>

      {/* 📊 ÍNDICE 2: LISTA DE TABLAS */}
      {lists.tablas.length > 0 && tocTablesPage && (
        <div id="toc-sheet-tablas">
          <Divider
            label="Salto de página hacia Lista de Tablas"
            labelPosition="center"
            color="gray.4"
            className="no-print"
          />
          <PageLayout metadata={projectMetadata} pageNumber={tocTablesPage}>
            <h1 className={classes.listTitle}>Lista de Tablas</h1>
            <div className={classes.pageIndicatorGroup}>
              <p className={classes.pageIndicatorText}>Pág.</p>
            </div>

            <Stack gap="xs" style={{ flex: 1 }}>
              {lists.tablas.map((table, index) => (
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

      {/* 🖼️ ÍNDICE 3: LISTA DE FIGURAS */}
      {lists.figuras.length > 0 && tocFiguresPage && (
        <div id="toc-sheet-figuras">
          <Divider
            label="Salto de página hacia Lista de Figuras"
            labelPosition="center"
            color="gray.4"
            className="no-print"
          />
          <PageLayout metadata={projectMetadata} pageNumber={tocFiguresPage}>
            <h1 className={classes.listTitle}>Lista de Figuras</h1>
            <div className={classes.pageIndicatorGroup}>
              <p className={classes.pageIndicatorText}>Pág.</p>
            </div>

            <Stack gap="xs" style={{ flex: 1 }}>
              {lists.figuras.map((fig, index) => (
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

      {/* 📎 ÍNDICE 4: LISTA DE ANEXOS */}
      {lists.anexos.length > 0 && tocAnnexesPage && (
        <div id="toc-sheet-anexos">
          <Divider
            label="Salto de página hacia Lista de Anexos"
            labelPosition="center"
            color="gray.4"
            className="no-print"
          />
          <PageLayout metadata={projectMetadata} pageNumber={tocAnnexesPage}>
            <h1 className={classes.listTitle}>Lista de Anexos</h1>
            <div className={classes.pageIndicatorGroup}>
              <p className={classes.pageIndicatorText}>Pág.</p>
            </div>

            <Stack gap="xs" style={{ flex: 1 }}>
              {lists.anexos.map((anexo, index) => (
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
    </>
  );
};

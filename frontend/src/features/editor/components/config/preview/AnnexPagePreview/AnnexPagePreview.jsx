// src/features/editor/components/config/preview/AnnexPagePreview/AnnexPagePreview.jsx
import React from "react";
import { Anchor, Stack } from "@mantine/core";
import { PageLayout } from "../PageLayout/PageLayout";
import { renderApaNote } from "@logic/utils/apaNoteFormatter";
import classes from "./AnnexPagePreview.module.css";

export const AnnexPagePreview = ({ item, metadata, pageNumber }) => {
  const finalPageNumber =
    pageNumber || metadata?._docMap?.anexos?.[item?.id] || "x";

  const renderAnnexBody = () => {
    switch (item?.type) {
      case "image":
        return (
          <div className={classes.imageBox}>
            <img
              src={
                item?.contentImage?.fileUrl ||
                "https://placehold.co/600x400?text=Sin+Imagen"
              }
              alt={item?.title || "Imagen del anexo"}
              className={classes.annexImage}
            />
          </div>
        );

      case "table": {
        const tableData = item?.contentTable || [];
        if (tableData.length === 0) return null;

        const headers = tableData[0] || [];
        const rows = tableData.slice(1);

        return (
          <table className={classes.annexTable}>
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i}>{h || " "}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{cell || " "}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }

      case "links":
        return (
          <Stack gap="xs" align="flex-start" className={classes.linksContainer}>
            {item?.contentLinks?.map((link, idx) => (
              <Anchor
                key={idx}
                href={link?.url}
                target="_blank"
                underline="hover"
                fw={600}
                c="blue.7"
                style={{ fontSize: "11pt" }}
              >
                • {link?.label || link?.url}
              </Anchor>
            ))}
          </Stack>
        );

      case "text":
      default:
        return <p className={classes.bodyText}>{item?.contentText}</p>;
    }
  };

  return (
    <PageLayout metadata={metadata} pageNumber={finalPageNumber}>
      <div className={classes.annexPageContainer}>
        {/* TÍTULO DEL ANEXO: Centrado horizontal en la parte superior */}
        <h1 className={classes.annexTitle}>
          Anexo {item?.id || "A"}. {item?.title || "Título del Anexo"}
        </h1>

        {/* CONTENIDO: Inicia inmediatamente debajo del título */}
        <div className={classes.annexContentWrapper}>{renderAnnexBody()}</div>

        {/* NOTA REGLAMENTARIA AL PIE */}
        {item?.description && item.description.trim().length > 0 && (
          <p className={classes.annexNote}>{renderApaNote(item.description)}</p>
        )}
      </div>
    </PageLayout>
  );
};

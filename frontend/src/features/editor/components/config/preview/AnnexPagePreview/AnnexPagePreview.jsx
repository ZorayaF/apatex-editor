import { Anchor, Stack } from "@mantine/core";
import { PageLayout } from "../PageLayout/PageLayout";
import classes from "./AnnexPagePreview.module.css";

// 1. Añadimos pageNumber a los props recibidos
export const AnnexPagePreview = ({ item, metadata, pageNumber }) => {
  const isCenteredType = ["image", "table", "links"].includes(item?.type);

  // 2. LÓGICA INTELIGENTE: Usamos el prop de exportación, o el fallback del docMap/"x"
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
              style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
            />
          </div>
        );

      case "table":
        const tableData = item?.contentTable || [];
        if (tableData.length === 0) return null;

        const headers = tableData[0] || [];
        const rows = tableData.slice(1);

        return (
          <table className={classes.annexTable}>
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i}>{h || "..."}</th>
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

      case "links":
        return (
          <Stack gap="xs" align="center">
            {item?.contentLinks?.map((link, idx) => (
              <Anchor
                key={idx}
                href={link?.url}
                target="_blank"
                underline="hover"
                fw="bold"
                c="blue.7"
                style={{ fontSize: "11pt" }}
              >
                {link?.label || link?.url}
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
    // 3. Pasamos el finalPageNumber al PageLayout
    <PageLayout metadata={metadata} pageNumber={finalPageNumber}>
      <div
        className={`${classes.contentContainer} ${
          isCenteredType ? classes.centeredContent : classes.startContent
        }`}
      >
        {/* TÍTULO DEL ANEXO */}
        <p className={classes.annexTitle}>
          Anexo {item?.id || "A"}. {item?.title || "Título del Anexo"}
        </p>

        {/* CUERPO DEL CONTENIDO VARIABLE */}
        <div style={{ width: "100%" }}>{renderAnnexBody()}</div>

        {/* NOTA REGLAMENTARIA AL PIE APA */}
        {item?.description && (
          <p className={classes.annexNote}>Nota. {item.description}</p>
        )}
      </div>
    </PageLayout>
  );
};

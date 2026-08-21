// src/features/editor/components/writer/blocks/complex/FigureBlock/FigureBlock.jsx
import { Text } from "@mantine/core";
import { useStore } from "@store";
import classes from "./FigureBlock.module.css";
import { renderApaNote } from "@logic/utils/apaNoteFormatter"; // o formatApaNote según como lo hayas nombrado

export const FigureBlock = ({ id, url, title, note, width = 100 }) => {
  const { blocks, setSelectedBlockId } = useStore();

  const figureNumber =
    blocks
      .filter((b) => b.type === "figure" || b.type === "figureBlock")
      .findIndex((b) => b.id === id) + 1;

  return (
    <div
      className={classes.figureContainer}
      onClick={() => setSelectedBlockId(id)}
    >
      {/* Etiqueta: Figura X */}
      <p className={classes.metaLabel}>Figura {figureNumber}</p>

      {/* Título: Cursiva */}
      <p className={classes.metaTitle}>{title || "Título de la figura"}</p>

      {/* Área del recurso visual */}
      <div className={classes.imageWrapper}>
        {url ? (
          <img
            src={url}
            alt={title || "Ilustración del documento"}
            className={classes.responsiveImg}
            style={{ "--fig-width": `${width}%` }}
          />
        ) : (
          <div className={classes.placeholderBox}>
            <Text c="dimmed" size="xs">
              Carga una imagen desde el Inspector
            </Text>
          </div>
        )}
      </div>

      {/* Nota académica */}
      {note && <p className={classes.figureNote}>{renderApaNote(note)}</p>}
    </div>
  );
};

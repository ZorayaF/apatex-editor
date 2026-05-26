import classes from "./ReferenceBlock.module.css";

export const ReferenceBlock = ({ blockId, data, isActive, onClick }) => {
  // Simulación de datos o fallback seguro por si el string viene vacío
  const previewText =
    data?.formattedText ||
    "García Márquez, G. (1967). Cien años de soledad. Editorial Sudamericana.";

  return (
    <div
      onClick={onClick}
      className={`${classes.referenceContainer} ${isActive ? classes.isActive : ""}`}
    >
      <p className={classes.referenceText}>{previewText}</p>
    </div>
  );
};

import classes from "./CitationInline.module.css";

export const CitationInline = ({ data, onClick }) => {
  // Fallback reglamentario si no hay datos cargados
  const label = data?.label || "(Autor, Año)";

  return (
    <span
      onClick={onClick}
      className={classes.citationBadge}
      role="button"
      tabIndex={0}
    >
      {label}
    </span>
  );
};

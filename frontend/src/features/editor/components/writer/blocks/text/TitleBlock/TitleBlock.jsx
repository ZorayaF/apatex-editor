import { BaseEditable } from "../core/BaseEditable";
import classes from "./TitleBlock.module.css";

const VALID_HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

export const TitleBlock = ({ id, content, type = "h1" }) => {
  // Permitimos encabezados del h1 al h6
  const safeTag = VALID_HEADINGS.includes(type) ? type : "h1";

  // Combinamos la clase base con la clase específica del nivel
  const titleClass = `${classes.titleBase} ${classes[safeTag] || ""}`;

  return (
    <BaseEditable
      id={id}
      content={content}
      tag={safeTag} // Ahora inyecta dinámicamente h1, h2, h3, h4, h5 o h6
      className={titleClass}
    />
  );
};

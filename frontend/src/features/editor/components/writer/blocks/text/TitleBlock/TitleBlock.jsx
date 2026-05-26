import { BaseEditable } from "../core/BaseEditable";
import classes from "./TitleBlock.module.css";

export const TitleBlock = ({ id, content, type = "h1" }) => {
  // Aseguramos que el tipo sea un encabezado válido por seguridad, si no, por defecto h1
  const safeTag = ["h1", "h2", "h3"].includes(type) ? type : "h1";

  // Combinamos la clase base con el modificador específico del nivel tipográfico
  const titleClass = `${classes.titleBase} ${classes[safeTag]}`;

  return (
    <BaseEditable
      id={id}
      content={content}
      tag={safeTag} // Inyecta dinámicamente <h1>, <h2> o <h3> en el DOM real
      className={titleClass}
    />
  );
};

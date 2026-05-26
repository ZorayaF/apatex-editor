import { BaseEditable } from "../core/BaseEditable";
import classes from "./TextBlock.module.css";

export const TextBlock = ({ id, content }) => {
  return (
    <BaseEditable
      id={id}
      content={content}
      tag="p" // Renderiza un párrafo semántico limpio en el HTML
      className={classes.paragraph}
    />
  );
};

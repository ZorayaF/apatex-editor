import { BaseEditable } from "./BaseEditable";

export const BLOCK_COMPONENTS = {
  h1: BaseEditable,
  h2: BaseEditable,
  h3: BaseEditable,
  h4: BaseEditable,
  h5: BaseEditable,
  paragraph: BaseEditable,
  // image: ImageBlock, <-- Aquí sí tendría sentido un archivo distinto
};

export const BLOCK_CONFIGS = {
  h1: { tag: "h1" },
  h2: { tag: "h2" },
  h3: { tag: "h3" },
  h4: { tag: "h4" },
  h5: { tag: "h5" },
  paragraph: { tag: "p" },
};

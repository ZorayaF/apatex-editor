import { BaseEditable } from "./BaseEditable";
import { ReferenceBlock } from "../complex/ReferenceBlock";
import { CitationInline } from "../complex/CitationInline.jsx";
import { TableBlock } from "../complex/TableBlock";
import { FigureBlock } from "../complex/FigureBlock";

export const BLOCK_COMPONENTS = {
  h1: BaseEditable,
  h2: BaseEditable,
  h3: BaseEditable,
  h4: BaseEditable,
  h5: BaseEditable,
  paragraph: BaseEditable,
  bullet: BaseEditable,
  reference: ReferenceBlock,
  citation: CitationInline,
  table: TableBlock,
  figure: FigureBlock,
};

export const BLOCK_CONFIGS = {
  h1: { tag: "h1" },
  h2: { tag: "h2" },
  h3: { tag: "h3" },
  h4: { tag: "h4" },
  h5: { tag: "h5" },
  paragraph: { tag: "p" },
  bullet: { tag: "div" },
  reference: { tag: "div" },
  citation: { tag: "span" },
  table: { tag: "div" },
  figure: { tag: "div" },
};

import { BaseEditable } from "./BaseEditable";
import { ReferenceBlock } from "@writer/blocks/complex/ReferenceBlock";
import { CitationInline } from "@writer/blocks/complex/CitationInline";
import { TableBlock } from "@writer/blocks/complex/TableBlock";
import { FigureBlock } from "@writer/blocks/complex/FigureBlock";
import { RunInHeadingBlock } from "@writer/blocks/text/RunInHeadingBlock/RunInHeadingBlock.jsx";

export const BLOCK_COMPONENTS = {
  h1: BaseEditable,
  h2: BaseEditable,
  h3: BaseEditable,
  h4: RunInHeadingBlock,
  h5: RunInHeadingBlock,
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

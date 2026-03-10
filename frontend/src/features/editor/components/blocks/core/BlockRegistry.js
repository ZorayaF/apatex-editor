// src/features/editor/components/blocks/core/BlockRegistry.js
import { TextBlock } from '../text/TextBlock';
import { TitleBlock } from '../text/TitleBlock';

// Aquí centralizas todos los tipos
export const BLOCK_COMPONENTS = {
  h1: TitleBlock,
  paragraph: TextBlock,
  // h2: SubtitleBlock,  <-- Añadir uno nuevo es así de simple
  // image: ImageBlock,
};

// Opcional: Props por defecto según el tipo
export const BLOCK_DEFAULTS = {
  h1: { level: 1 },
  paragraph: {},
};

// src/features/editor/components/blocks/BlockFactory.jsx
import { TextBlock } from '../text/TextBlock';
import { TitleBlock } from '../text/TitleBlock';

export const BlockFactory = (block) => {
  switch (block.type) {
    case 'h1':
      return <TitleBlock id={block.id} content={block.content} level={1} />;
    case 'paragraph':
      return <TextBlock id={block.id} content={block.content} />;
    default:
      return <div>Tipo de bloque no soportado</div>;
  }
};

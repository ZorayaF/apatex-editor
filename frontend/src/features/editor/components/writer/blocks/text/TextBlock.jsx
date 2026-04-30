import { BaseEditable } from '../core/BaseEditable';
import { DOCUMENT_THEME } from '@editor/logic/rules/documentStyles';

export const TextBlock = ({ id, content }) => (
  <BaseEditable
    id={id}
    content={content}
    tag="p"
    style={DOCUMENT_THEME.blocks.paragraph} // Aplicamos los estilos directos
    className="editor-block-p"
  />
);

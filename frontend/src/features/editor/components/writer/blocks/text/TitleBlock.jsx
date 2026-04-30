import { BaseEditable } from '../core/BaseEditable';
import { DOCUMENT_THEME } from '@editor/logic/rules/documentStyles';

export const TitleBlock = ({ id, content, level = 1 }) => (
  <BaseEditable
    id={id}
    content={content}
    tag="h1"
    style={DOCUMENT_THEME.blocks.h1}
    className="editable-h1" // Para que el CSS counter lo encuentre
  />
);

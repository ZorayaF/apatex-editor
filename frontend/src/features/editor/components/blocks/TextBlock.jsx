// src/features/editor/components/blocks/TextBlock.jsx
import { BaseEditable } from './BaseEditable';
import { cmToPx, ptToPx, APA_CONFIG } from '@core/utils/measurements';

export const TextBlock = ({ id, content }) => {
  const { typography } = APA_CONFIG;

  const textStyles = {
    fontFamily: typography.family,
    fontSize: `${ptToPx(typography.size)}px`,
    lineHeight: typography.lineHeight,
    textAlign: 'justify',
    textIndent: `${cmToPx(typography.indent)}px`, // Sangría 1.27cm
  };

  return <BaseEditable id={id} content={content} styles={textStyles} />;
};

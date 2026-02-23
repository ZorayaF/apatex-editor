// src/features/editor/components/blocks/TitleBlock.jsx
import { BaseEditable } from './BaseEditable';
import { ptToPx, APA_CONFIG } from '@core/utils/measurements';

export const TitleBlock = ({ id, content, level = 1 }) => {
  const { typography } = APA_CONFIG;

  const titleStyles = {
    fontFamily: typography.family,
    fontSize: `${ptToPx(typography.size)}px`,
    fontWeight: 'bold',
    textAlign: level === 1 ? 'center' : 'left', // Nivel 1 centrado, el resto a la izquierda
    lineHeight: typography.lineHeight,
    textIndent: 0, // Los títulos no llevan sangría
  };

  return <BaseEditable id={id} content={content} styles={titleStyles} />;
};

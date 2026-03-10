import { BLOCK_COMPONENTS, BLOCK_DEFAULTS } from './BlockRegistry';

export const BlockFactory = ({ block }) => {
  // 1. Si el bloque no existe (es undefined), salimos elegantemente
  if (!block) {
    console.warn("Se intentó renderizar un bloque nulo o inexistente.");
    return null;
  }

  const Component = BLOCK_COMPONENTS[block.type];

  if (!Component) {
    return <div style={{ color: 'red' }}>Tipo "{block.type}" no soportado</div>;
  }

  const extraProps = BLOCK_DEFAULTS[block.type] || {};

  return (
    <Component
      id={block.id}
      content={block.content}
      {...extraProps}
    />
  );
};

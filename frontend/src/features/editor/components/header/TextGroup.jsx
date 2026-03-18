// features/editor/components/header/TextGroup.jsx
import React from "react";
import { Group } from "@mantine/core";
import {
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconTypography,
  IconQuote,
} from "@tabler/icons-react";
import { useStore } from "@store";
import { HeaderButton } from "./HeaderButton";

export const TextGroup = () => {
  const { addBlock, selectedBlockId, blocks } = useStore();

  const activeBlock = blocks.find((b) => b.id === selectedBlockId);
  const activeType = activeBlock ? activeBlock.type : null;

  return (
    <Group gap={4}>
      <HeaderButton
        label="Título 1"
        description="Encabezado principal"
        icon={IconH1}
        onClick={() => addBlock("h1")}
        isActive={activeType === "h1"}
      />
      <HeaderButton
        label="Título 2"
        description="Subtítulo de sección"
        icon={IconH2}
        onClick={() => addBlock("h2")}
        isActive={activeType === "h2"}
      />
      {/* Nuevo componente H3 */}
      <HeaderButton
        label="Título 3"
        description="Encabezado de tercer nivel"
        icon={IconH3}
        onClick={() => addBlock("h3")}
        isActive={activeType === "h3"}
      />
      <HeaderButton
        label="Título 4"
        description="Encabezado de cuarto nivel"
        icon={IconH4}
        onClick={() => addBlock("h4")}
        isActive={activeType === "h4"}
      />
      <HeaderButton
        label="Título 5"
        description="Encabezado de quinto nivel"
        icon={IconH5}
        onClick={() => addBlock("h5")}
        isActive={activeType === "h5"}
      />
      <HeaderButton
        label="Párrafo"
        description="Texto normal"
        icon={IconTypography}
        onClick={() => addBlock("paragraph")}
        isActive={activeType === "paragraph"}
      />
      <HeaderButton
        label="Cita"
        description="Bloque de cita"
        icon={IconQuote}
        onClick={() => addBlock("blockquote")}
        isActive={activeType === "blockquote"}
      />
    </Group>
  );
};

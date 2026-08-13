import React from "react";
import { Group } from "@mantine/core";
import {
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconTypography,
  IconList,
} from "@tabler/icons-react";
import { useStore } from "@store";
import { HeaderButton } from "../HeaderButton";

// Mapa estático de íconos para evitar el uso de eval()
const HEADING_ICONS = {
  1: IconH1,
  2: IconH2,
  3: IconH3,
  4: IconH4,
  5: IconH5,
};

export const FormattingGroup = () => {
  const { addBlock, selectedBlockId, blocks } = useStore();
  const activeBlock = blocks.find((b) => b.id === selectedBlockId);
  const activeType = activeBlock ? activeBlock.type : null;

  return (
    <Group gap={4}>
      {[1, 2, 3, 4, 5].map((level) => (
        <HeaderButton
          key={level}
          label={`H${level}`}
          description={`Título nivel ${level}`}
          icon={HEADING_ICONS[level]} // <-- Usamos el mapa en lugar de eval
          onClick={() => addBlock(`h${level}`)}
          isActive={activeType === `h${level}`}
        />
      ))}
      <HeaderButton
        label="Párrafo"
        description="Texto normal"
        icon={IconTypography}
        onClick={() => addBlock("paragraph")}
        isActive={activeType === "paragraph"}
      />
      <HeaderButton
        label="Lista"
        description="Viñetas"
        icon={IconList}
        onClick={() => addBlock("bullet")}
        isActive={activeType === "bullet"}
      />
    </Group>
  );
};

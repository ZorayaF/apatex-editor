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
import { isTextBlock } from "@logic/rules/blockRules";

const HEADING_ICONS = {
  1: IconH1,
  2: IconH2,
  3: IconH3,
  4: IconH4,
  5: IconH5,
};

export const FormattingGroup = () => {
  const { addBlock, setBlockType, selectedBlockId, blocks } = useStore();
  const activeBlock = blocks.find((b) => b.id === selectedBlockId);
  const activeType = activeBlock ? activeBlock.type : null;

  const handleSelectType = (targetType) => {
    // Si el bloque actual es de texto, transformamos su tipo directamente
    if (activeBlock && isTextBlock(activeBlock.type)) {
      setBlockType(activeBlock.id, targetType);
    } else {
      // Si no hay selección o es un bloque complejo, agregamos uno nuevo
      addBlock(targetType);
    }
  };

  return (
    <Group gap={4}>
      {[1, 2, 3, 4, 5].map((level) => {
        const headingType = `h${level}`;
        return (
          <HeaderButton
            key={level}
            label={`H${level}`}
            description={`Título nivel ${level}`}
            icon={HEADING_ICONS[level]}
            onClick={() => handleSelectType(headingType)}
            isActive={activeType === headingType}
          />
        );
      })}
      <HeaderButton
        label="Párrafo"
        description="Texto normal"
        icon={IconTypography}
        onClick={() => handleSelectType("paragraph")}
        isActive={activeType === "paragraph"}
      />
      <HeaderButton
        label="Lista"
        description="Viñetas"
        icon={IconList}
        onClick={() => handleSelectType("bullet")}
        isActive={activeType === "bullet"}
      />
    </Group>
  );
};

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
import { HeaderButton } from "./HeaderButton";

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
          icon={eval(`IconH${level}`)}
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

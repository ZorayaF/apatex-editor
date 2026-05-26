// src/features/editor/components/config/preview/SimplePagePreview.jsx
import { Box, Text } from "@mantine/core";
import { APA_CONFIG, cmToPx } from "@core/utils/measurements";

export const SimplePagePreview = ({ type, data }) => {
  const { paper, margins, typography } = APA_CONFIG;

  const sectionsWithoutTitle = ["dedicatoria", "reglamento"];
  const shouldHideTitle = sectionsWithoutTitle.includes(type);

  // REGLA APA: Sangría de primera línea para la introducción
  const isIntroduccion = type === "introduccion";

  const pageStyle = {
    width: `${cmToPx(paper.width)}px`,
    height: `${cmToPx(paper.height)}px`,
    backgroundColor: "white",
    padding: `${cmToPx(margins.top)}px ${cmToPx(margins.right)}px ${cmToPx(margins.bottom)}px ${cmToPx(margins.left)}px`,
    boxSizing: "border-box",
    fontFamily: typography.family,
    fontSize: `${typography.size}pt`,
    lineHeight: 2,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };

  return (
    <Box style={pageStyle}>
      {!shouldHideTitle && (
        <Text
          ta="center"
          fw="bold"
          mb="xl"
          style={{ textTransform: "capitalize" }}
        >
          {type}
        </Text>
      )}

      {/* 
          TEXTO CON SANGRÍA: 
          Si es introducción, aplicamos textIndent de 1.27cm (0.5 pulgadas) 
      */}
      <Text
        style={{
          textAlign: "justify",
          whiteSpace: "pre-wrap",
          textIndent: isIntroduccion ? "1.27cm" : "0",
        }}
      >
        {data?.content || `[Contenido de la sección ${type}]`}
      </Text>
    </Box>
  );
};

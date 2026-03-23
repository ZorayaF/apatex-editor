import React from "react";
import { TextInput, NumberInput, Stack } from "@mantine/core";
import { REFERENCE_FIELDS } from "../../../../logic/references/fieldDefinitions";
import { InspectorField } from "../../InspectorField";

export const DynamicReferenceForm = ({ schema, data, onChange }) => {
  // Los campos base que SIEMPRE están en la raíz del objeto
  const BASE_FIELDS = ["author", "year", "title"];

  return (
    <Stack gap="md">
      {schema.fields.map((fieldName) => {
        const config = REFERENCE_FIELDS[fieldName];

        // Si por error pedimos un campo que no existe en el diccionario
        if (!config) return null;

        // Determinamos si el valor viene de la raíz o de metadata
        const isBase = BASE_FIELDS.includes(fieldName);
        const value = isBase ? data[fieldName] : data.metadata?.[fieldName];

        // Función para manejar el cambio dinámicamente
        const handleChange = (val) => {
          if (isBase) {
            onChange(fieldName, val);
          } else {
            // Actualizamos el objeto metadata sin perder lo que ya había
            onChange("metadata", {
              ...data.metadata,
              [fieldName]: val,
            });
          }
        };

        return (
          <InspectorField
            key={fieldName}
            label={config.label}
            description={config.description}
          >
            {config.type === "number" ? (
              <NumberInput
                placeholder={config.placeholder}
                value={value || ""}
                onChange={handleChange}
                hideControls
              />
            ) : (
              <TextInput
                placeholder={config.placeholder}
                value={value || ""}
                onChange={(e) => handleChange(e.currentTarget.value)}
              />
            )}
          </InspectorField>
        );
      })}
    </Stack>
  );
};

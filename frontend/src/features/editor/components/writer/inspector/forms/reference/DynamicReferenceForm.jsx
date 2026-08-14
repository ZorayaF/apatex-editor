import React from "react";
import { TextInput, NumberInput, Stack } from "@mantine/core";
import { REFERENCE_FIELDS } from "@logic/references/fieldDefinitions";
import { InspectorField } from "@writer/inspector/InspectorField";

import classes from "./DynamicReferenceForm.module.css";

export const DynamicReferenceForm = ({ schema, data, onChange }) => {
  const BASE_FIELDS = ["author", "year", "title"];

  if (!schema?.fields) return null;

  return (
    <Stack className={classes.fieldsContainer}>
      {schema.fields.map((fieldName) => {
        const config = REFERENCE_FIELDS[fieldName];
        if (!config) return null;

        const isBase = BASE_FIELDS.includes(fieldName);
        const value = isBase ? data[fieldName] : data.metadata?.[fieldName];

        const handleChange = (val) => {
          if (isBase) {
            onChange(fieldName, val);
          } else {
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
                value={value ?? ""}
                onChange={(val) => handleChange(val === "" ? "" : Number(val))}
                hideControls
                size="xs"
              />
            ) : (
              <TextInput
                placeholder={config.placeholder}
                value={value || ""}
                onChange={(e) => handleChange(e.currentTarget.value)}
                size="xs"
              />
            )}
          </InspectorField>
        );
      })}
    </Stack>
  );
};

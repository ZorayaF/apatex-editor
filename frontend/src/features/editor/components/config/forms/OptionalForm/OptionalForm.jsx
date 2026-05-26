import { Stack, Textarea, Fieldset, Text, Alert } from "@mantine/core";
import { useStore } from "@store";
import classes from "./OptionalForm.module.css";

export const OptionalForm = ({ type = "dedicatoria" }) => {
  const { projectMetadata, setProjectMetadata } = useStore();
  const data = projectMetadata?.preliminares?.[type];

  return (
    <Stack gap="xl">
      <Fieldset variant="unstyled">
        <Textarea
          label={`Contenido de la ${type}`}
          placeholder={`Escribe aquí tu ${type}...`}
          minRows={15} // Extensión idónea para redacción libre preliminar
          autosize
          value={data?.content || ""}
          onChange={(e) =>
            setProjectMetadata(`preliminares.${type}.content`, e.target.value)
          }
        />
      </Fieldset>
    </Stack>
  );
};

import { Stack, Textarea, Fieldset, Text } from "@mantine/core";
import { useStore } from "@store";
import classes from "./IntroductionForm.module.css";

export const IntroductionForm = () => {
  const { projectMetadata, setProjectMetadata } = useStore();

  // Apuntamos de manera segura a la ruta de la introducción en el Store
  const data = projectMetadata?.preliminares?.introduccion;

  return (
    <Stack gap="xl">
      {/* Caja de sugerencia técnica estilizada por clases CSS Modules */}
      <div className={classes.directivePaper}>
        <p className={classes.directiveLabel}>DIRECTRIZ INSTITUCIONAL:</p>
        <p className={classes.directiveText}>
          La introducción debe presentar de manera clara el tema, los objetivos
          y la estructura del trabajo. El sistema aplicará la sangría
          reglamentaria de 1.27 cm automáticamente en la primera línea de cada
          párrafo.
        </p>
      </div>

      <Fieldset variant="unstyled">
        <Textarea
          label="Redacción de la Introducción"
          placeholder="Comienza a redactar la introducción de tu proyecto de grado..."
          minRows={18} // Extensión cómoda para redacción larga
          autosize
          value={data?.content || ""}
          onChange={(e) =>
            setProjectMetadata(
              "preliminares.introduccion.content",
              e.target.value,
            )
          }
        />
      </Fieldset>
    </Stack>
  );
};

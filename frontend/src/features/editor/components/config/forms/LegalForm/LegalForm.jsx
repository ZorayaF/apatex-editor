// src/features/editor/components/config/forms/LegalForm/LegalForm.jsx
import { Stack, Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import classes from "./LegalForm.module.css";

export const LegalForm = () => {
  return (
    <Stack gap="lg">
      {/* Alerta de Mantine unificada con las directrices visuales del sistema */}
      <Alert
        variant="light"
        color="blue"
        title="Nota Importante"
        icon={<IconInfoCircle size={18} />}
      >
        Esta sección es obligatoria según el reglamento de la institución y se
        incluirá automáticamente.
      </Alert>

      {/* Contenedor de la cláusula reglamentaria purificado por CSS Modules */}
      <div className={classes.legalClausePaper}>
        <p className={classes.clauseLabel}>TEXTO DE LA NOTA:</p>
        <p className={classes.clauseText}>
          “Únicamente el graduando es responsable de las ideas expuestas en el
          presente trabajo”. (Lineamientos constitucionales, legales e
          institucionales que rigen la propiedad intelectual).
        </p>
      </div>

      <p className={classes.footerNotice}>
        * No se requieren campos adicionales para esta sección.
      </p>
    </Stack>
  );
};

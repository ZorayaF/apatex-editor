// src/features/editor/store/projectSlice.js

const initialState = {
  tituloProyecto: "",
  autores: [],
  tipoTrabajo: "Monografía",
  gradoObjetivo: "",
  director: { nombre: "", titulo: "" },
  codirector: { nombre: "", titulo: "" },
  institucion: "Universidad de Boyacá",
  facultad: "",
  programa: "",
  ubicacion: "Tunja",
  anio: new Date().getFullYear(),
};

export const createProjectSlice = (set) => ({
  projectMetadata: initialState,

  // Versión robusta de actualización
  setProjectMetadata: (path, value) =>
    set((state) => {
      // Si el path tiene un punto (ej: "director.nombre")
      if (path.includes(".")) {
        const [parent, child] = path.split(".");
        return {
          projectMetadata: {
            ...state.projectMetadata,
            [parent]: {
              ...state.projectMetadata[parent],
              [child]: value,
            },
          },
        };
      }

      // Si es un campo de primer nivel (ej: "tituloProyecto")
      return {
        projectMetadata: {
          ...state.projectMetadata,
          [path]: value,
        },
      };
    }),
});

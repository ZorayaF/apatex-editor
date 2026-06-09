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
  preliminares: {
    aceptacion: {
      enabled: true,
      ciudad: "Tunja",
      fecha: "",
      jurados: ["", ""],
    },
    reglamento: { enabled: true },
    dedicatoria: { enabled: false, content: "" },
    agradecimientos: { enabled: false, content: "" },
    glosario: { enabled: false, terms: [] }, // <--- IMPORTANTE: que sea [] y no undefined
    resumen: { enabled: true, content: "", palabrasClave: "" },
    abstract: { enabled: true, content: "", keywords: "" },
  },
};

export const createProjectSlice = (set) => ({
  // 1. EL NUEVO ESTADO: Guarda la ruta del archivo actual (null si es un proyecto nuevo)
  currentFilePath: null,

  // 2. LA NUEVA ACCIÓN: Permite a Electron actualizar la ruta después de guardar o abrir
  setCurrentFilePath: (path) => set({ currentFilePath: path }),

  // 3. TU ESTADO ORIGINAL: Los datos del documento APA
  projectMetadata: initialState,

  // 4. TU LÓGICA ORIGINAL INTACTA
  setProjectMetadata: (path, value) =>
    set((state) => {
      const keys = path.split(".");
      const newMetadata = { ...state.projectMetadata };
      let current = newMetadata;

      // Navegamos por el objeto hasta el penúltimo nivel
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      // Asignamos el valor en el último nivel
      current[keys[keys.length - 1]] = value;

      return { projectMetadata: newMetadata };
    }),
});

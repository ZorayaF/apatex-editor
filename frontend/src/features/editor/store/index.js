// src/features/editor/store/index.js
import { create } from "zustand";
import { createContentSlice } from "./contentSlice";
import { createUiSlice } from "./uiSlice";
import { createProjectSlice } from "./projectSlice"; // 1. Importamos el nuevo slice

export const useStore = create((...a) => ({
  ...createContentSlice(...a),
  ...createUiSlice(...a),
  ...createProjectSlice(...a), // 2. Lo esparcimos aquí
}));

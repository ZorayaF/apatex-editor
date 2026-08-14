// src/features/editor/store/index.js
import { create } from "zustand";
import { createContentSlice } from "./contentSlice";
import { createUiSlice } from "./uiSlice";
import { createProjectSlice } from "./projectSlice";

export const useStore = create((...a) => ({
  ...createContentSlice(...a),
  ...createUiSlice(...a),
  ...createProjectSlice(...a),
}));

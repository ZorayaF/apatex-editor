// src/features/editor/store/index.js
import { create } from 'zustand';
import { createContentSlice } from './contentSlice';
import { createUiSlice } from './uiSlice';

// Renombramos a useStore para que coincida con tus componentes
export const useStore = create((...a) => ({
  ...createContentSlice(...a),
  ...createUiSlice(...a),
}));

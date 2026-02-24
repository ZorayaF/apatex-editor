import { create } from 'zustand';
import { createContentSlice } from './contentSlice';
import { createUiSlice } from './uiSlice';

// Unimos los "slices" en un solo hook
export const useDocumentStore = create((...a) => ({
  ...createContentSlice(...a),
  ...createUiSlice(...a),
}));

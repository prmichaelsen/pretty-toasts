import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Toast, ToastOptions, ToastState } from "../types";

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: "prettyToasts",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<ToastOptions>) => {
      const { id, type, title, message, duration = 10000, progress } = action.payload;
      const toastId = id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const existingToastIndex = state.toasts.findIndex((t) => t.id === toastId);

      if (existingToastIndex === -1) {
        const toast: Toast = {
          id: toastId,
          type,
          title,
          message,
          duration,
          progress,
          isPaused: false,
          isPermanent: false,
          createdAt: Date.now(),
        };
        state.toasts.push(toast);
      }
    },

    updateToast: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Toast>;
      }>
    ) => {
      const { id, updates } = action.payload;
      const existingToastIndex = state.toasts.findIndex((t) => t.id === id);

      if (existingToastIndex !== -1) {
        state.toasts[existingToastIndex] = {
          ...state.toasts[existingToastIndex],
          ...updates,
        };
      }
    },

    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },

    pauseToast: (state, action: PayloadAction<string>) => {
      const toast = state.toasts.find((t) => t.id === action.payload);
      if (toast) {
        toast.isPaused = true;
      }
    },

    resumeToast: (state, action: PayloadAction<string>) => {
      const toast = state.toasts.find((t) => t.id === action.payload);
      if (toast) {
        toast.isPaused = false;
      }
    },

    makeToastPermanent: (state, action: PayloadAction<string>) => {
      const toast = state.toasts.find((t) => t.id === action.payload);
      if (toast) {
        toast.isPermanent = true;
        toast.isPaused = true;
      }
    },

    clearAllToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const {
  addToast,
  updateToast,
  removeToast,
  pauseToast,
  resumeToast,
  makeToastPermanent,
  clearAllToasts,
} = toastSlice.actions;

export default toastSlice.reducer;

// Selectors
export const selectToasts = (state: { prettyToasts: ToastState }) => state.prettyToasts.toasts;
export const selectActiveToasts = (state: { prettyToasts: ToastState }) =>
  state.prettyToasts.toasts.filter((toast) => !toast.isPermanent);
export const selectPermanentToasts = (state: { prettyToasts: ToastState }) =>
  state.prettyToasts.toasts.filter((toast) => toast.isPermanent);

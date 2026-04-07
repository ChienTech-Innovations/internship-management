import { create } from "zustand";

type LoadingState = {
  isLoading: boolean;
};

type Action = {
  showLoading: () => void;
  hideLoading: () => void;
};

const initialState: LoadingState = {
  isLoading: false
};

export const useLoadingStore = create<LoadingState & Action>((set) => ({
  ...initialState,
  showLoading: () => set({ isLoading: true }),
  hideLoading: () => set({ isLoading: false })
}));

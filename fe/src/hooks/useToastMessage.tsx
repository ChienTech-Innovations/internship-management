import { useToastStore } from "@/store/useToastStore";

export const useToastMessage = () => {
  const { showToastSuccess, showToastError } = useToastStore.getState();
  return { showToastSuccess, showToastError };
};

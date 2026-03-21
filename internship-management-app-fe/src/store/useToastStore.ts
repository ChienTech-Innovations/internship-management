import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { create } from "zustand";

type ToastState = {
  showToastSuccess: (message: string) => void;
  showToastError: (message: string) => void;
};

export const useToastStore = create<ToastState>(() => ({
  showToastSuccess: (message) => {
    toast({
      className: cn(
        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 border-none text-white font-semibold text-lg p-4 rounded-lg shadow-lg"
      ),
      description: message,
      variant: "default",
      duration: 2000
    });
  },
  showToastError: (message) => {
    toast({
      className: cn(
        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-red-600 border-none text-white font-semibold text-lg p-4 rounded-lg shadow-lg"
      ),
      description: message,
      variant: "destructive",
      duration: 2000
    });
  }
}));

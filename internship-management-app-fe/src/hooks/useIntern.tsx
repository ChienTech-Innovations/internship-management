import { useCustomSWR } from "@/lib/swr/useCustomSWR";
import { internServices } from "@/services/intern.services";
import { useAuthStore } from "@/store/useAuthStore";

export const useGetInternById = (id: string) => {
  return useCustomSWR(`/interns-information/${id}`, () =>
    internServices.getInternById(id)
  );
};
export const useGetInternAll = () => {
  return useCustomSWR("/interns-information", internServices.getInternAll);
};

export const useGetInternInfoAll = () => {
  const { userDetails } = useAuthStore();
  const isIntern = userDetails?.role?.toLowerCase() === "intern";
  const key = isIntern ? "/interns-information/interns" : null;
  return useCustomSWR(
    key,
    isIntern ? internServices.getInternInfoAll : undefined
  );
};

export const useGetInternInfoAllById = (id: string) => {
  return useCustomSWR(`/interns-information/interns/${id}`, () =>
    internServices.getInternInfoAllById(id)
  );
};

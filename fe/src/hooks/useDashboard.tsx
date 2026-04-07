import { useCustomSWR } from "@/lib/swr/useCustomSWR";
import { InternsData, MyInternsResponse } from "@/types/dashboard.type";

export const useGetInternsDataDashboard = () => {
  return useCustomSWR<InternsData>(`/dashboard/admin`);
};

export const useGetInfoMentorDashboard = (showFetch?: boolean) => {
  return useCustomSWR<MyInternsResponse>(
    showFetch ? "/dashboard/mentor" : null
  );
};

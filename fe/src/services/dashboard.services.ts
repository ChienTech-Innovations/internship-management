import { get } from "@/services/api.services";
import { InternsData, MyInternsResponse } from "@/types/dashboard.type";

export const dashboardServices = {
  getInternsDataDashboard: () => {
    return get<InternsData>("/dashboard/admin");
  },
  getInfoMentorDashboard: () => {
    return get<MyInternsResponse>("/dashboard/mentor");
  }
};

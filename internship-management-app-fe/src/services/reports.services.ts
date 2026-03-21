import { get } from "@/services/api.services";
import { API_URL } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";

export type PeriodReport = {
  period: "week" | "month";
  from: string;
  to: string;
  internsCount: number;
  submissionsCount: number;
  attendance: {
    totalRegistered: number;
    officeDays: number;
    remoteDays: number;
  };
};

export const reportsServices = {
  getReport: (period: "week" | "month", from: string, to: string) => {
    return get<PeriodReport>(
      `/reports?period=${period}&from=${from}&to=${to}`
    );
  },

  /** Download CSV report (uses auth token) */
  exportCsv: async (
    period: "week" | "month",
    from: string,
    to: string
  ): Promise<void> => {
    const { accessToken } = useAuthStore.getState();
    const url = `${API_URL}/reports/export?period=${period}&from=${from}&to=${to}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken || ""}`,
      },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Export failed");
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `report-${period}-${from}-${to}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  },
};

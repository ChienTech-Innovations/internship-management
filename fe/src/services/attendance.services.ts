import { get, post, del } from "@/services/api.services";
import {
  AdminWeekViewResponse,
  DayAttendance,
  InternMonthAttendance,
  InternWeekAttendance,
  PersonalAttendanceStats,
  WorkLocation
} from "@/types/attendance.type";

export const attendanceServices = {
  // Intern đăng ký chấm công
  registerAttendance: (
    date: string,
    workLocation: WorkLocation,
    latitude?: number,
    longitude?: number
  ) => {
    return post("/attendance", { date, workLocation, latitude, longitude });
  },

  // Intern xem tuần của mình
  getMyWeek: (weekStart: string) => {
    return get<DayAttendance[]>(`/attendance/my-week?weekStart=${weekStart}`);
  },

  // Intern xem tháng (calendar)
  getMyMonth: (month: string) => {
    return get<DayAttendance[]>(`/attendance/my-month?month=${month}`);
  },

  // Mentor xem intern
  getMentorWeek: (weekStart: string) => {
    return get<InternWeekAttendance[]>(
      `/attendance/mentor-week?weekStart=${weekStart}`
    );
  },

  // Mentor xem tháng (calendar)
  getMentorMonth: (month: string) => {
    return get<InternMonthAttendance[]>(
      `/attendance/mentor-month?month=${month}`
    );
  },

  // Admin xem tất cả
  getAdminWeek: (weekStart: string) => {
    return get<AdminWeekViewResponse>(
      `/attendance/admin-week?weekStart=${weekStart}`
    );
  },

  // Admin xem tháng (calendar)
  getAdminMonth: (month: string) => {
    return get<AdminWeekViewResponse>(
      `/attendance/admin-month?month=${month}`
    );
  },

  // Thống kê
  getStats: (userId?: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return get<PersonalAttendanceStats>(
      `/attendance/stats?${params.toString()}`
    );
  },

  // Hủy đăng ký
  deleteAttendance: (id: string) => {
    return del(`/attendance/${id}`);
  }
};

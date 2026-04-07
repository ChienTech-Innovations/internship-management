export type WorkLocation = "office" | "remote";

export type AttendanceRecord = {
  id: string;
  workLocation: WorkLocation;
  createdAt: string;
};

export type DayAttendance = {
  date: string;
  dayOfWeek: string;
  dayNumber: number;
  attendance: AttendanceRecord | null;
};

export type InternWeekAttendance = {
  internId: string;
  internName: string;
  field: string;
  weekData: DayAttendance[];
};

export type InternMonthAttendance = {
  internId: string;
  internName: string;
  field: string;
  monthData: DayAttendance[];
};

export type AdminInternWeekAttendance = InternWeekAttendance & {
  mentorName: string;
};

export type AttendanceStats = {
  totalInterns: number;
  registeredToday: number;
  officeToday: number;
  remoteToday: number;
  notRegisteredToday: number;
  weeklyRegistrationRate: number;
};

export type AdminWeekViewResponse = {
  interns: AdminInternWeekAttendance[];
  stats: AttendanceStats;
};

export type PersonalAttendanceStats = {
  totalRegistered: number;
  officeDays: number;
  remoteDays: number;
  notRegistered: number;
  totalDays: number;
};

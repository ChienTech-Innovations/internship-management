"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Home,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  CalendarDays
} from "lucide-react";
import { attendanceServices } from "@/services/attendance.services";
import { InternWeekAttendance, InternMonthAttendance } from "@/types/attendance.type";
import { toast } from "sonner";
import { motion } from "framer-motion";

const getWeekStart = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
};

const getMonthStr = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

type ViewMode = "week" | "month";

const MentorAttendance = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [weekStart, setWeekStart] = useState(() =>
    getWeekStart(new Date())
  );
  const [monthStr, setMonthStr] = useState(() => getMonthStr(new Date()));
  const [internsData, setInternsData] = useState<InternWeekAttendance[]>([]);
  const [monthInternsData, setMonthInternsData] = useState<InternMonthAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  const todayStr = new Date().toISOString().split("T")[0];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await attendanceServices.getMentorWeek(weekStart);
      setInternsData(res.data || []);
    } catch {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

  const fetchMonthData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await attendanceServices.getMentorMonth(monthStr);
      setMonthInternsData(res.data || []);
    } catch {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  }, [monthStr]);

  useEffect(() => {
    if (viewMode === "week") fetchData();
    else fetchMonthData();
  }, [viewMode, fetchData, fetchMonthData]);

  const navigateWeek = (direction: number) => {
    const current = new Date(weekStart);
    current.setDate(current.getDate() + direction * 7);
    setWeekStart(current.toISOString().split("T")[0]);
  };

  const navigateMonth = (direction: number) => {
    const [y, m] = monthStr.split("-").map(Number);
    const d = new Date(y, m - 1 + direction, 1);
    setMonthStr(getMonthStr(d));
  };

  const formatMonthTitle = () => {
    const [y, m] = monthStr.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("vi-VN", {
      month: "long",
      year: "numeric"
    });
  };

  const weekEndDate = new Date(weekStart);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  const formatDateRange = () => {
    const start = new Date(weekStart);
    const end = weekEndDate;
    return `${start.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })} - ${end.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}`;
  };

  // Build day headers (week or month)
  const weekDayHeaders =
    internsData.length > 0
      ? internsData[0].weekData.map((d) => ({
          dayOfWeek: d.dayOfWeek,
          dayNumber: d.dayNumber,
          date: d.date
        }))
      : [];
  const monthDayHeaders =
    monthInternsData.length > 0
      ? monthInternsData[0].monthData.map((d) => ({
          dayOfWeek: d.dayOfWeek,
          dayNumber: d.dayNumber,
          date: d.date
        }))
      : [];
  const dayHeaders = viewMode === "week" ? weekDayHeaders : monthDayHeaders;
  const displayInterns = viewMode === "week" ? internsData : monthInternsData;

  // Quick stats (from week data for display)
  const totalInterns = displayInterns.length;
  const todayRegistered = displayInterns.filter((intern) =>
    (viewMode === "week" ? (intern as InternWeekAttendance).weekData : (intern as InternMonthAttendance).monthData).some(
      (d: { date: string; attendance: unknown }) => d.date === todayStr && d.attendance !== null
    )
  ).length;
  const todayOffice = displayInterns.filter((intern) =>
    (viewMode === "week" ? (intern as InternWeekAttendance).weekData : (intern as InternMonthAttendance).monthData).some(
      (d: { date: string; attendance?: { workLocation: string } | null }) =>
        d.date === todayStr && d.attendance?.workLocation === "office"
    )
  ).length;
  const todayRemote = displayInterns.filter((intern) =>
    (viewMode === "week" ? (intern as InternWeekAttendance).weekData : (intern as InternMonthAttendance).monthData).some(
      (d: { date: string; attendance?: { workLocation: string } | null }) =>
        d.date === todayStr && d.attendance?.workLocation === "remote"
    )
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Attendance – Interns
        </h1>
        <p className="text-muted-foreground mt-1">
          Track intern check-ins
        </p>
        <div className="flex rounded-lg border border-input bg-muted/30 p-1 mt-2">
          <Button
            variant={viewMode === "week" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("week")}
            className="rounded-md"
          >
            Week
          </Button>
          <Button
            variant={viewMode === "month" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("month")}
            className="rounded-md"
          >
            <CalendarDays className="w-4 h-4 mr-1" />
            Month (Calendar)
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total interns</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalInterns}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-200/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Checked in today
                </p>
                <p className="text-2xl font-bold text-cyan-600">
                  {todayRegistered}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{totalInterns}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-200/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Office today</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {todayOffice}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Home className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remote today</p>
                <p className="text-2xl font-bold text-purple-600">
                  {todayRemote}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Week / Month Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {viewMode === "week" ? `Week ${formatDateRange()}` : formatMonthTitle()}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => (viewMode === "week" ? navigateWeek(-1) : navigateMonth(-1))}
                className="h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (viewMode === "week" ? setWeekStart(getWeekStart(new Date())) : setMonthStr(getMonthStr(new Date())))}
                className="h-8 text-xs"
              >
                {viewMode === "week" ? "This week" : "This month"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => (viewMode === "week" ? navigateWeek(1) : navigateMonth(1))}
                className="h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-muted/50 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : displayInterns.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">
                No interns yet
              </p>
              <p className="text-sm">
                Assigned interns will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-3 font-semibold text-sm border-b-2 min-w-[160px] sticky left-0 bg-background z-10">
                      Intern
                    </th>
                    {dayHeaders.map((day) => (
                      <th
                        key={day.date}
                        className={`text-center p-2 font-semibold text-sm border-b-2 min-w-[44px] ${
                          day.date === todayStr
                            ? "bg-blue-50 text-blue-600 border-blue-300"
                            : ""
                        }`}
                      >
                        <div className="text-[10px]">{day.dayOfWeek}</div>
                        <div className="text-sm">{day.dayNumber}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayInterns.map((intern, idx) => {
                    const weekOrMonthData = viewMode === "week" ? (intern as InternWeekAttendance).weekData : (intern as InternMonthAttendance).monthData;
                    return (
                    <motion.tr
                      key={intern.internId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3 sticky left-0 bg-background z-10">
                        <div className="font-medium text-sm">
                          {intern.internName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {intern.field || "—"}
                        </div>
                      </td>
                      {weekOrMonthData.map((day) => (
                        <td
                          key={day.date}
                          className={`text-center p-2 ${
                            day.date === todayStr ? "bg-blue-50/50" : ""
                          }`}
                        >
                          {day.attendance ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  day.attendance.workLocation === "office"
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-purple-100 text-purple-600"
                                }`}
                              >
                                {day.attendance.workLocation === "office" ? (
                                  <Building2 className="w-4 h-4" />
                                ) : (
                                  <Home className="w-4 h-4" />
                                )}
                              </div>
                              <span className="text-[10px] text-muted-foreground">
                                {day.attendance.workLocation === "office"
                                  ? "Office"
                                  : "Remote"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-lg">
                              —
                            </span>
                          )}
                        </td>
                      ))}
                    </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <Building2 className="w-3 h-3 text-emerald-600" />
          </div>
          <span>Office</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
            <Home className="w-3 h-3 text-purple-600" />
          </div>
          <span>Remote</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">—</span>
          <span>No check-in</span>
        </div>
      </div>
    </div>
  );
};

export default MentorAttendance;

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Home,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  MapPin,
  Laptop,
  Loader2
} from "lucide-react";
import { attendanceServices } from "@/services/attendance.services";
import { DayAttendance, WorkLocation } from "@/types/attendance.type";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

const getWeekStart = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  return d.toISOString().split("T")[0];
};

const getMonthStr = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

type ViewMode = "week" | "month";

const InternAttendance = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [weekData, setWeekData] = useState<DayAttendance[]>([]);
  const [monthStr, setMonthStr] = useState(() => getMonthStr(new Date()));
  const [monthData, setMonthData] = useState<DayAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showLocationErrorDialog, setShowLocationErrorDialog] = useState(false);
  const [locationErrorMessage, setLocationErrorMessage] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const fetchWeekData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await attendanceServices.getMyWeek(weekStart);
      setWeekData(res.data || []);
    } catch {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

  const fetchMonthData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await attendanceServices.getMyMonth(monthStr);
      setMonthData(res.data || []);
    } catch {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  }, [monthStr]);

  useEffect(() => {
    if (viewMode === "week") fetchWeekData();
    else fetchMonthData();
  }, [viewMode, fetchWeekData, fetchMonthData]);

  // Lấy vị trí GPS từ trình duyệt
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Trình duyệt không hỗ trợ định vị GPS"));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    });
  };

  const handleRegister = async (date: string, location: WorkLocation) => {
    try {
      setActionLoading(date);

      let latitude: number | undefined;
      let longitude: number | undefined;

      // Nếu chọn "office", lấy GPS trước
      if (location === "office") {
        try {
          setGettingLocation(true);
          toast.info("Getting your location...");
          const position = await getCurrentPosition();
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch (geoError: unknown) {
          const err = geoError as GeolocationPositionError;
          if (err.code === 1) {
            toast.error(
              "Location access is required to check in at office"
            );
          } else if (err.code === 2) {
            toast.error("Could not get location. Please try again");
          } else if (err.code === 3) {
            toast.error("Location request timed out. Please try again");
          } else {
            toast.error("Location error");
          }
          return;
        } finally {
          setGettingLocation(false);
        }
      }

      await attendanceServices.registerAttendance(
        date,
        location,
        latitude,
        longitude
      );

      toast.success(
        `Checked in ${location === "office" ? "at office" : "remote"}`
      );
      if (viewMode === "week") await fetchWeekData();
      else await fetchMonthData();
    } catch (error: unknown) {
      console.error("Attendance registration error:", error);

      // Extract error message from various error types
      let errorMessage = "Registration failed";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String(error.message);
      }

      // Check if error is about location being out of range
      // Backend returns: "Bạn đang ở cách công ty Xm. Cần ở trong phạm vi Ym để chấm công tại công ty."
      if (
        location === "office" &&
        (errorMessage.includes("cách công ty") ||
          errorMessage.includes("phạm vi") ||
          errorMessage.includes("Cần ở trong"))
      ) {
        // Show dialog for location error
        setLocationErrorMessage(errorMessage);
        setShowLocationErrorDialog(true);
      } else {
        // Show toast for other errors
        toast.error(errorMessage);
      }
    } finally {
      setActionLoading(null);
      setGettingLocation(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      setActionLoading(deleteConfirmId);
      setDeleteConfirmId(null);
      await attendanceServices.deleteAttendance(deleteConfirmId);
      toast.success("Check-in cancelled");
      if (viewMode === "week") await fetchWeekData();
      else await fetchMonthData();
    } catch {
      toast.error("Failed to cancel check-in");
    } finally {
      setActionLoading(null);
    }
  };

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

  const weekEndDate = new Date(weekStart);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  const formatDateRange = () => {
    const start = new Date(weekStart);
    const end = weekEndDate;
    return `${start.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })} - ${end.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}`;
  };

  const formatMonthTitle = () => {
    const [y, m] = monthStr.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("vi-VN", {
      month: "long",
      year: "numeric"
    });
  };

  // Calendar grid for month: Monday = 0
  const getDayCol = (date: Date) => (date.getDay() + 6) % 7;
  const monthCalendarStart = (() => {
    const [y, m] = monthStr.split("-").map(Number);
    const first = new Date(y, m - 1, 1);
    return getDayCol(first);
  })();
  const monthCalendarDays = (() => {
    const [y, m] = monthStr.split("-").map(Number);
    const last = new Date(y, m, 0).getDate();
    return last;
  })();
  const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  // Count stats for this week
  const officeDays = weekData.filter(
    (d) => d.attendance?.workLocation === "office"
  ).length;
  const remoteDays = weekData.filter(
    (d) => d.attendance?.workLocation === "remote"
  ).length;
  const registeredDays = officeDays + remoteDays;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Attendance
          </h1>
          <p className="text-muted-foreground mt-1">
            Daily work location check-in
          </p>
        </div>
        <div className="flex rounded-lg border border-input bg-muted/30 p-1">
          <Button
            variant={viewMode === "week" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("week")}
            className="rounded-md"
          >
            Tuần
          </Button>
          <Button
            variant={viewMode === "month" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("month")}
            className="rounded-md"
          >
            Month (Calendar)
          </Button>
        </div>
      </div>

      {/* Week Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Checked in</p>
                <p className="text-2xl font-bold text-blue-600">
                  {registeredDays}
                  <span className="text-sm font-normal text-muted-foreground">
                    /7
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
                <p className="text-sm text-muted-foreground">Office</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {officeDays}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Laptop className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remote</p>
                <p className="text-2xl font-bold text-purple-600">
                  {remoteDays}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Week View */}
      {viewMode === "week" && (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Week {formatDateRange()}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek(-1)}
                className="h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWeekStart(getWeekStart(new Date()))}
                className="h-8 text-xs"
              >
                This week
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek(1)}
                className="h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-7 gap-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 bg-muted/50 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-3">
              <AnimatePresence mode="wait">
                {weekData.map((day, index) => {
                  const isToday = day.date === todayStr;
                  const isPast = day.date < todayStr;
                  const hasAttendance = !!day.attendance;

                  return (
                    <motion.div
                      key={day.date}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all min-h-[160px] ${
                        isToday
                          ? "border-blue-400 bg-blue-50/50 shadow-lg shadow-blue-100"
                          : hasAttendance
                            ? "border-emerald-200 bg-emerald-50/30"
                            : isPast
                              ? "border-gray-200 bg-gray-50/50 opacity-60"
                              : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      {/* Day label */}
                      <div className="text-center">
                        <p
                          className={`text-xs font-medium ${isToday ? "text-blue-600" : "text-muted-foreground"}`}
                        >
                          {day.dayOfWeek}
                        </p>
                        <p
                          className={`text-lg font-bold ${isToday ? "text-blue-600" : ""}`}
                        >
                          {day.dayNumber}
                        </p>
                      </div>

                      {isToday && (
                        <Badge
                          variant="default"
                          className="text-[10px] px-1.5 py-0 bg-blue-500"
                        >
                          Today
                        </Badge>
                      )}

                      {/* Status */}
                      {hasAttendance ? (
                        <div className="flex flex-col items-center gap-1.5 flex-1 justify-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              day.attendance!.workLocation === "office"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-purple-100 text-purple-600"
                            }`}
                          >
                            {day.attendance!.workLocation === "office" ? (
                              <Building2 className="w-5 h-5" />
                            ) : (
                              <Home className="w-5 h-5" />
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-medium ${
                              day.attendance!.workLocation === "office"
                                ? "text-emerald-600"
                                : "text-purple-600"
                            }`}
                          >
                            {day.attendance!.workLocation === "office"
                              ? "Office"
                              : "Remote"}
                          </span>
                          {isToday && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteClick(day.attendance!.id)}
                              disabled={actionLoading === day.attendance!.id}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ) : isToday ? (
                        <div className="flex flex-col gap-1.5 flex-1 justify-center w-full">
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-emerald-500 hover:bg-emerald-600 w-full"
                            onClick={() => handleRegister(day.date, "office")}
                            disabled={
                              actionLoading === day.date || gettingLocation
                            }
                          >
                            {gettingLocation && actionLoading === day.date ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <MapPin className="w-3 h-3 mr-1" />
                            )}
                            Office
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs border-purple-300 text-purple-600 hover:bg-purple-50 w-full"
                            onClick={() => handleRegister(day.date, "remote")}
                            disabled={
                              actionLoading === day.date || gettingLocation
                            }
                          >
                            <Laptop className="w-3 h-3 mr-1" />
                            Remote
                          </Button>
                          <p className="text-[9px] text-muted-foreground text-center mt-0.5">
                            📍 Office requires location
                          </p>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            {isPast ? "No check-in" : "—"}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Month Calendar View */}
      {viewMode === "month" && (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {formatMonthTitle()}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth(-1)}
                className="h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMonthStr(getMonthStr(new Date()))}
                className="h-8 text-xs"
              >
                This month
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth(1)}
                className="h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAY_LABELS.map((l) => (
                <div key={l} className="text-center text-xs font-medium text-muted-foreground py-1" />
              ))}
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="h-14 bg-muted/50 animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAY_LABELS.map((l) => (
                <div key={l} className="text-center text-xs font-medium text-muted-foreground py-1">
                  {l}
                </div>
              ))}
              {Array.from({ length: monthCalendarStart }).map((_, i) => (
                <div key={`pad-${i}`} className="h-14 rounded bg-muted/20" />
              ))}
              {Array.from({ length: monthCalendarDays }).map((_, i) => {
                const dayNum = i + 1;
                const [y, m] = monthStr.split("-").map(Number);
                const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const dayInfo = monthData.find((d) => d.date === dateStr);
                const isToday = dateStr === todayStr;
                const isPast = dateStr < todayStr;
                const hasAttendance = !!dayInfo?.attendance;
                return (
                  <div
                    key={dateStr}
                    className={`h-14 rounded border p-1 flex flex-col items-center justify-center text-sm ${
                      isToday ? "border-blue-400 bg-blue-50/50" : hasAttendance ? "border-emerald-200 bg-emerald-50/30" : isPast ? "bg-muted/30 opacity-70" : "bg-background"
                    }`}
                  >
                    <span className={isToday ? "font-bold text-blue-600" : ""}>{dayNum}</span>
                    {hasAttendance ? (
                      <div className="flex items-center gap-0.5">
                        {dayInfo.attendance!.workLocation === "office" ? (
                          <Building2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Home className="w-3 h-3 text-purple-600" />
                        )}
                        {isToday && (
                          <button
                            type="button"
                            className="text-red-400 hover:text-red-600 p-0.5"
                            onClick={() => handleDeleteClick(dayInfo.attendance!.id)}
                            disabled={actionLoading === dayInfo.attendance!.id}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ) : isToday ? (
                      <div className="flex gap-0.5">
                        <Button
                          size="sm"
                          className="h-5 text-[10px] px-1 bg-emerald-500 hover:bg-emerald-600"
                          onClick={() => handleRegister(dateStr, "office")}
                          disabled={actionLoading === dateStr || gettingLocation}
                        >
                          <MapPin className="w-2.5 h-2.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-5 text-[10px] px-1 border-purple-300"
                          onClick={() => handleRegister(dateStr, "remote")}
                          disabled={actionLoading === dateStr || gettingLocation}
                        >
                          <Laptop className="w-2.5 h-2.5" />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Location Error Dialog */}
      <Dialog
        open={showLocationErrorDialog}
        onOpenChange={setShowLocationErrorDialog}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  Location out of range
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Cannot check in at office
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {locationErrorMessage ||
                "You are too far from the office to check in here."}
            </p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 font-medium mb-1">
                💡 Suggestion:
              </p>
              <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                <li>
                  Move closer to the office to check in at office
                </li>
                <li>
                  Or choose &quot;Remote&quot; if you are working from home
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowLocationErrorDialog(false)}
              className="w-full"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        title="Cancel check-in?"
        description="Are you sure you want to cancel this day's check-in?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};

export default InternAttendance;

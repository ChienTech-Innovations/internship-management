"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Users, ClipboardList, CalendarCheck, Download, Building2, Home } from "lucide-react";
import { reportsServices, PeriodReport } from "@/services/reports.services";
import { toast } from "sonner";
import { PageHeader } from "@/components/HeaderContent";
import { TableSkeleton } from "@/components/common/Skeleton";

const getWeekRange = (date: Date): { from: string; to: string } => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  const from = d.toISOString().split("T")[0];
  d.setDate(d.getDate() + 6);
  const to = d.toISOString().split("T")[0];
  return { from, to };
};

const getMonthRange = (date: Date): { from: string; to: string } => {
  const y = date.getFullYear();
  const m = date.getMonth();
  const from = new Date(y, m, 1).toISOString().split("T")[0];
  const to = new Date(y, m + 1, 0).toISOString().split("T")[0];
  return { from, to };
};

export default function ReportsContent() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [report, setReport] = useState<PeriodReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const now = new Date();
  const defaultRange = period === "week" ? getWeekRange(now) : getMonthRange(now);
  const [from, setFrom] = useState(defaultRange.from);
  const [to, setTo] = useState(defaultRange.to);

  const loadReport = useCallback(async () => {
    try {
      setLoading(true);
      const res = await reportsServices.getReport(period, from, to);
      setReport(res.data ?? null);
    } catch {
      toast.error("Failed to load report");
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [period, from, to]);

  const handlePeriodChange = (value: "week" | "month") => {
    setPeriod(value);
    const range = value === "week" ? getWeekRange(now) : getMonthRange(now);
    setFrom(range.from);
    setTo(range.to);
    setReport(null);
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await reportsServices.exportCsv(period, from, to);
      toast.success("CSV downloaded");
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Period Reports"
        description="Interns, submissions and attendance by week or month. Mentors see only their interns."
        icon={<FileText className="w-5 h-5" />}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Period</label>
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="flex h-9 w-36 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex h-9 w-36 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            />
          </div>
          <Button onClick={loadReport} disabled={loading} className="bg-gradient-to-r from-blue-500 to-cyan-500">
            View Report
          </Button>
          {report && (
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          )}
        </CardContent>
      </Card>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TableSkeleton rows={2} cols={1} showHeader={false} showToolbar={false} />
          <TableSkeleton rows={2} cols={1} showHeader={false} showToolbar={false} />
          <TableSkeleton rows={2} cols={1} showHeader={false} showToolbar={false} />
        </div>
      )}

      {!loading && report && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Interns</p>
                <p className="text-2xl font-bold text-blue-600">{report.internsCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-200/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submissions</p>
                <p className="text-2xl font-bold text-cyan-600">{report.submissionsCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-200/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance (days)</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {report.attendance.totalRegistered}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!loading && report && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attendance breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Office</p>
                  <p className="text-xl font-bold">{report.attendance.officeDays}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Home className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Remote</p>
                  <p className="text-xl font-bold">{report.attendance.remoteDays}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !report && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Select period and click &quot;View Report&quot; to see data.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

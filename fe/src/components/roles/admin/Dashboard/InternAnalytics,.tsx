"use client";

import { formatMonth } from "@/lib/helper";
import { InternsData } from "@/types/dashboard.type";
import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface IProps {
  internsData: InternsData;
}

const STATUS_COLORS = ["#22C55E", "#3B82F6", "#F59E0B"]; // Completed, In progress, Onboarding

function getColorByIndex(index: number) {
  return STATUS_COLORS[index % STATUS_COLORS.length];
}

export const InternAnalytics = ({ internsData }: IProps) => {
  const formattedMonthlyData = internsData.monthlyInternsCount.map((item) => ({
    ...item,
    month: formatMonth(item.month),
  }));

  const totalInterns = internsData.internsCount.total;
  const statusData = [
    { name: "Completed", value: internsData.internsCount.completed },
    { name: "In progress", value: internsData.internsCount.inProgress },
    { name: "Onboarding", value: internsData.internsCount.onboarding },
  ].filter((d) => d.value > 0);

  const mentorData = (internsData.mentorInternsCount || []).map((m) => ({
    name: m.mentorName?.length > 12 ? m.mentorName.slice(0, 12) + "…" : m.mentorName,
    fullName: m.mentorName,
    count: m.count,
  }));

  const fieldData = (internsData.fieldInternsCount || []).map((f) => ({
    name: f.field || "Unset",
    count: f.count,
  }));

  const tooltipStyle = {
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Key metrics summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-slate-50/80 p-3 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold text-slate-800">{totalInterns}</p>
        </div>
        <div className="rounded-lg border bg-emerald-50/80 p-3 text-center">
          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Completed</p>
          <p className="text-2xl font-bold text-emerald-700">{internsData.internsCount.completed}</p>
        </div>
        <div className="rounded-lg border bg-blue-50/80 p-3 text-center">
          <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">In progress</p>
          <p className="text-2xl font-bold text-blue-700">{internsData.internsCount.inProgress}</p>
        </div>
        <div className="rounded-lg border bg-amber-50/80 p-3 text-center">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Onboarding</p>
          <p className="text-2xl font-bold text-amber-700">{internsData.internsCount.onboarding}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard
          title="New interns by month"
          description="Interns who started in each month (this year)"
          accentColor="from-violet-400 to-violet-600"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={formattedMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: "#8B5CF6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Status distribution"
          description="Share of interns by current status"
          accentColor="from-emerald-400 to-teal-500"
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusData.length ? statusData : [{ name: "No data", value: 1 }]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={50}
                paddingAngle={2}
                strokeWidth={2}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {(statusData.length ? statusData : [{ name: "No data", value: 1 }]).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={statusData.length ? getColorByIndex(index) : "#e2e8f0"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => [value, totalInterns ? `(${Math.round((value / totalInterns) * 100)}%)` : ""]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard
          title="Workload by mentor"
          description="Number of interns supervised per mentor"
          accentColor="from-cyan-400 to-cyan-600"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={mentorData}
              layout="vertical"
              margin={{ left: 8, right: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number, _n: string, props: { payload?: { fullName?: string } }) => [v, props.payload?.fullName || ""]} />
              <Bar dataKey="count" fill="#06B6D4" radius={[0, 4, 4, 0]} name="Interns" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Interns by field"
          description="Distribution by technical field"
          accentColor="from-indigo-400 to-indigo-600"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={fieldData}
              layout="vertical"
              margin={{ left: 8, right: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#4F46E5" radius={[0, 4, 4, 0]} name="Interns" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

const ChartCard = ({
  title,
  description,
  children,
  accentColor = "from-blue-400 to-blue-600",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  accentColor?: string;
}) => (
  <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-5 relative overflow-hidden">
    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentColor}`} />
    <h3 className="text-sm font-bold text-gray-800 mb-0.5">{title}</h3>
    <p className="text-xs text-muted-foreground mb-3">{description}</p>
    {children}
  </div>
);

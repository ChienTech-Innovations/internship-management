import { StatsCard } from "@/components/StatsCard";
import {
  BarChart4,
  PieChart,
  Loader,
  ChartBar,
  CircleCheck
} from "lucide-react";
import React from "react";

type Props = {
  totalInterns: number;
  totalCompleted: number;
  totalInProgress: number;
  totalOnboarding: number;
  totalField: number;
};

const DashboardStatsCard: React.FC<Props> = ({
  totalInterns,
  totalCompleted,
  totalInProgress,
  totalOnboarding,
  totalField
}) => {
  const stats = [
    {
      icon: <BarChart4 className="w-6 h-6" />,
      title: "Total Interns",
      count: totalInterns,
      description: "Total number of interns across the system",
      color: "blue" as const
    },
    {
      icon: <ChartBar className="w-6 h-6" />,
      title: "Total Fields",
      count: totalField,
      description: "Total distinct internship fields (e.g., Frontend, Backend)",
      color: "cyan" as const
    },
    {
      icon: <CircleCheck className="w-6 h-6" />,
      title: "Completed Interns",
      count: totalCompleted,
      description: "Interns who have completed their internship",
      color: "emerald" as const
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "In Progress",
      count: totalInProgress,
      description: "Interns currently participating in the program",
      color: "orange" as const
    },
    {
      icon: <Loader className="w-6 h-6" />,
      title: "Onboarding Interns",
      count: totalOnboarding,
      description: "Interns in the onboarding stage",
      color: "purple" as const
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.slice(0, 2).map((s) => (
          <StatsCard
            key={s.title}
            title={s.title}
            count={s.count}
            icon={s.icon}
            description={s.description}
            color={s.color}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stats.slice(2, 5).map((s) => (
          <StatsCard
            key={s.title}
            title={s.title}
            count={s.count}
            icon={s.icon}
            description={s.description}
            color={s.color}
          />
        ))}
      </div>
    </>
  );
};

export default DashboardStatsCard;

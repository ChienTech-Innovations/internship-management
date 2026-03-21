import { StatsCard } from "@/components/StatsCard";
import { PieChart, Loader, CircleCheck, Users } from "lucide-react";
import React from "react";

type Props = {
  totalInterns: number;
  totalCompleted: number;
  totalInProgress: number;
  totalOnboarding: number;
};

const DashboardStatsCard: React.FC<Props> = ({
  totalInterns,
  totalCompleted,
  totalInProgress,
  totalOnboarding
}) => {
  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Total Interns",
      count: totalInterns,
      description: "Total number of interns assigned",
      color: "blue" as const
    },
    {
      icon: <CircleCheck className="w-6 h-6" />,
      title: "Completed",
      count: totalCompleted,
      description: "Interns who completed the program",
      color: "emerald" as const
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "In Progress",
      count: totalInProgress,
      description: "Interns currently in training",
      color: "orange" as const
    },
    {
      icon: <Loader className="w-6 h-6" />,
      title: "Onboarding",
      count: totalOnboarding,
      description: "Interns in the onboarding phase",
      color: "purple" as const
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
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

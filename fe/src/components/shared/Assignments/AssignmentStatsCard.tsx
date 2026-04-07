import { StatsCard } from "@/components/StatsCard";
import { ListTodo, UserCheck, Users } from "lucide-react";
import React from "react";

type Props = {
  totalTodo: number;
  totalInProgress: number;
  totalSubmitted: number;
  totalReviewed: number;
};

const AssignmentStatsCard: React.FC<Props> = ({
  totalTodo,
  totalInProgress,
  totalSubmitted,
  totalReviewed
}) => {
  const stats = [
    {
      icon: Users,
      title: "Total Interns",
      count: totalTodo,
      description: "All interns registered"
    },
    {
      icon: Users,
      title: "Active Interns",
      count: totalInProgress,
      description: "Currently active"
    },
    {
      icon: UserCheck,
      title: "Active Mentors",
      count: totalSubmitted,
      description: "Mentors available"
    },
    {
      icon: ListTodo,
      title: "Assignments",
      count: totalReviewed,
      description: "Tasks assigned"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <StatsCard
          key={s.title}
          title={s.title}
          count={s.count}
          icon={<s.icon className="w-5 h-5 text-current" />}
          description={s.description}
          className={`hover:shadow-md rounded-xl`}
        />
      ))}
    </div>
  );
};

export default AssignmentStatsCard;

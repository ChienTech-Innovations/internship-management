"use client";

import React from "react";
import { StatsCard } from "@/components/StatsCard";
import { User, UserCheck, UserLock, Users } from "lucide-react";

type Props = {
  totalUsers: number;
  totalAdmins: number;
  totalMentors: number;
  totalInterns: number;
};

export const UserStatsCard: React.FC<Props> = ({
  totalUsers,
  totalAdmins,
  totalMentors,
  totalInterns
}) => {
  const stats = [
    {
      icon: Users,
      title: "Total Users",
      count: totalUsers,
      description: "All users registered",
      color: "blue" as const
    },
    {
      icon: UserLock,
      title: "Total Admin",
      count: totalAdmins,
      description: "Currently active",
      color: "amber" as const
    },
    {
      icon: UserCheck,
      title: "Total Mentor",
      count: totalMentors,
      description: "Mentors available",
      color: "emerald" as const
    },
    {
      icon: User,
      title: "Total Intern",
      count: totalInterns,
      description: "Interns enrolled",
      color: "cyan" as const
    }
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, index) => (
        <StatsCard
          key={index}
          title={s.title}
          count={s.count}
          description={s.description}
          icon={<s.icon className="w-5 h-5" />}
          color={s.color}
        />
      ))}
    </div>
  );
};

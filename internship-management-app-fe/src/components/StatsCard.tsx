import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const colorMap = {
  blue: {
    card: "bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/50",
    icon: "bg-blue-500/20 text-blue-600",
    count: "text-blue-600",
  },
  emerald: {
    card: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-200/50",
    icon: "bg-emerald-500/20 text-emerald-600",
    count: "text-emerald-600",
  },
  purple: {
    card: "bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/50",
    icon: "bg-purple-500/20 text-purple-600",
    count: "text-purple-600",
  },
  orange: {
    card: "bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200/50",
    icon: "bg-orange-500/20 text-orange-600",
    count: "text-orange-600",
  },
  cyan: {
    card: "bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-200/50",
    icon: "bg-cyan-500/20 text-cyan-600",
    count: "text-cyan-600",
  },
  amber: {
    card: "bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-200/50",
    icon: "bg-amber-500/20 text-amber-600",
    count: "text-amber-600",
  },
  rose: {
    card: "bg-gradient-to-br from-rose-500/10 to-rose-600/5 border-rose-200/50",
    icon: "bg-rose-500/20 text-rose-600",
    count: "text-rose-600",
  },
};

export type StatsCardColor = keyof typeof colorMap;

type StatsCardProps = {
  title: string;
  count: number;
  icon: React.ReactNode;
  description: string;
  className?: string;
  color?: StatsCardColor;
};

export const StatsCard = ({
  title,
  count,
  icon,
  description,
  className,
  color = "blue",
}: StatsCardProps) => {
  const theme = colorMap[color];

  return (
    <Card
      className={cn(
        "rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default",
        theme.card,
        className
      )}
    >
      <CardHeader className="flex items-center gap-3">
        <div
          className={cn(
            "w-11 h-11 flex items-center justify-center rounded-xl shrink-0",
            theme.icon
          )}
        >
          {icon}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn("text-2xl font-bold", theme.count)}>{count}</p>
          <CardDescription className="text-xs">{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};

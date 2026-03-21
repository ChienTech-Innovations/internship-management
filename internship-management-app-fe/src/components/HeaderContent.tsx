import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export const PageHeader = ({
  title,
  description,
  icon,
  action,
  className,
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gradient-to-r from-white via-white to-slate-50/80 border-b border-slate-200/80 shadow-sm",
        className
      )}
    >
      <div className="flex items-start md:items-center gap-3">
        {icon && (
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-600 shadow-sm">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {action && <div>{action}</div>}
    </div>
  );
};

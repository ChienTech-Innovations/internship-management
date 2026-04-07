import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sortByRole = <T>(array: T[], dataKey: keyof T) => {
  const roleOrder: { [key: string]: number } = {
    admin: 1,
    mentor: 2,
    intern: 3
  };

  return [...array].sort((a, b) => {
    const roleA = a[dataKey] as unknown as string;
    const roleB = b[dataKey] as unknown as string;
    return roleOrder[roleA] - roleOrder[roleB];
  });
};

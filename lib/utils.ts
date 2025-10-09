import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type DateFormatOptions = {
  withYear?: boolean;
};

export const formatDate = (
  date: string | Date,
  options: DateFormatOptions = { withYear: true }
): string => {
  const d = new Date(date);
  return d.toLocaleDateString("zh-TW", {
    year: options.withYear ? "numeric" : undefined,
    month: "long",
    day: "numeric",
  });
};

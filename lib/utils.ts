import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Locale } from "./i18n/locales"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type DateFormatOptions = {
  withYear?: boolean;
  locale?: Locale;
};

const localeMap: Record<Locale, string> = {
  zh: 'zh-TW',
  ja: 'ja',
  en: 'en-US',
};

export const formatDate = (
  date: string | Date,
  options: DateFormatOptions = { withYear: true, locale: 'zh' }
): string => {
  const d = new Date(date);
  const locale = options.locale || 'zh';

  return d.toLocaleDateString(localeMap[locale], {
    year: options.withYear ? "numeric" : undefined,
    month: "long",
    day: "numeric",
  });
};

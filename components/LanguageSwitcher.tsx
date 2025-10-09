"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { locales, type Locale } from "@/lib/i18n/locales";
import { getTranslation } from "@/lib/i18n/translations";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const t = getTranslation(locale);

  const getLanguageUrl = (targetLocale: Locale) => {
    // If we're on app/ (no locale prefix), navigate to /[locale]/path
    if (!pathname.startsWith('/zh') && !pathname.startsWith('/ja') && !pathname.startsWith('/en')) {
      return `/${targetLocale}${pathname}`;
    }

    // If we're on app/[locale]/, switch locale prefix
    const pathWithoutLocale = pathname.replace(/^\/(zh|ja|en)/, '');
    return targetLocale === 'zh' ? pathWithoutLocale || '/' : `/${targetLocale}${pathWithoutLocale || ''}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Switch language">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((lang) => (
          <DropdownMenuItem key={lang} asChild>
            <Link
              href={getLanguageUrl(lang)}
              className={locale === lang ? "font-bold" : ""}
            >
              {t.languageNames[lang]}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

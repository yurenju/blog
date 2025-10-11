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
  const t = getTranslation(locale);
  const pathname = usePathname();

  /**
   * Generate the target path for a given locale while maintaining context
   * - For post detail pages: navigate to home page (posts may not have translations)
   * - For other pages (home, about, subscription, categories): stay on same page type
   */
  const getTargetPath = (targetLocale: Locale): string => {
    // Remove current locale prefix from pathname
    // Example: /zh/tech → /tech, /ja/about → /about
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';

    // Check if it's a post detail page (pattern: /posts/[slug])
    const isPostDetailPage = /^\/posts\/.+/.test(pathWithoutLocale);

    if (isPostDetailPage) {
      // For post detail pages, navigate to home page of target locale
      return `/${targetLocale}/`;
    }

    // For all other pages, maintain the same path with new locale
    return `/${targetLocale}${pathWithoutLocale}`;
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
              href={getTargetPath(lang)}
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

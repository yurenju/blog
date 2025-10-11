"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "./ThemeToggleButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locales";
import type { Category } from "@/lib/posts";

interface NavbarProps {
  locale: Locale;
  category: Category | null;
}

const Navbar = ({ locale, category }: NavbarProps) => {
  const t = getTranslation(locale);

  // Determine category link based on category prop
  const showCategoryLink = category !== null;
  const categoryLinkHref = category ? `/${locale}/${category}` : '';
  const categoryLinkText = category === 'tech'
    ? t.nav.allTechPosts
    : t.nav.allLifePosts;

  return (
    <nav className="top-0 left-0 right-0 h-16 border-b border-border">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" asChild>
            <Link href={`/${locale}/`}>{t.nav.home}</Link>
          </Button>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" asChild>
            <Link href={`/${locale}/about`}>{t.nav.about}</Link>
          </Button>
          <span className="text-muted-foreground">•</span>
          <Button variant="ghost" asChild>
            <Link href={`/${locale}/subscription`}>{t.nav.subscription}</Link>
          </Button>
          {showCategoryLink && (
            <>
              <span className="text-muted-foreground">•</span>
              <Button variant="ghost" asChild>
                <Link href={categoryLinkHref}>{categoryLinkText}</Link>
              </Button>
            </>
          )}
          <ThemeToggleButton locale={locale} />
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

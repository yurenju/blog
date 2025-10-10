"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "./ThemeToggleButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locales";

const Navbar = ({ locale = 'zh' }: { locale?: Locale }) => {
  const t = getTranslation(locale);
  const prefix = locale === 'zh' ? '' : `/${locale}`;

  return (
    <nav className="top-0 left-0 right-0 h-16 border-b border-border">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" asChild>
            <Link href={`${prefix}/`}>{t.nav.home}</Link>
          </Button>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" asChild>
            <Link href={`${prefix}/about`}>{t.nav.about}</Link>
          </Button>
          <span className="text-muted-foreground">•</span>
          <Button variant="ghost" asChild>
            <Link href={`${prefix}/subscription`}>{t.nav.subscription}</Link>
          </Button>
          <span className="text-muted-foreground">•</span>
          <Button variant="ghost" asChild>
            <Link href={`${prefix}/posts`}>{t.nav.allPosts}</Link>
          </Button>
          <ThemeToggleButton locale={locale} />
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

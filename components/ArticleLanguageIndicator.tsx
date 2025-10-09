import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/lib/i18n/locales";
import { getTranslation } from "@/lib/i18n/translations";

export function ArticleLanguageIndicator({
  availableLocales,
  currentLocale,
  slug,
}: {
  availableLocales: Locale[];
  currentLocale: Locale;
  slug: string;
}) {
  const t = getTranslation(currentLocale);
  const otherLocales = availableLocales.filter((l) => l !== currentLocale);

  if (otherLocales.length === 0) {
    return null;
  }

  return (
    <div className="text-sm text-muted-foreground mb-4">
      <span>{t.post.alsoAvailableIn} </span>
      {otherLocales.map((locale, index) => (
        <span key={locale}>
          {index > 0 && <span> </span>}
          <Link href={`/${locale}/posts/${slug}`}>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              {t.languageNames[locale]}
            </Badge>
          </Link>
        </span>
      ))}
    </div>
  );
}

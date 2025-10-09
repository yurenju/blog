import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type { Locale } from "@/lib/i18n/locales";
import { getTranslation } from "@/lib/i18n/translations";

export function LanguageNotice({
  locale,
  chinesePostCount,
}: {
  locale: Locale;
  chinesePostCount: number;
}) {
  const t = getTranslation(locale);

  // Only show for non-Chinese locales
  if (locale === 'zh') {
    return null;
  }

  return (
    <Alert className="mt-8">
      <Info className="h-4 w-4" />
      <AlertDescription>
        {t.languageNotice.mainlyInChinese}。
        {t.languageNotice.currentlyHas} {chinesePostCount} {t.languageNotice.articles}。
        <Link href="/posts" className="underline ml-1">
          {t.languageNotice.switchToChinese}
        </Link>
        。
      </AlertDescription>
    </Alert>
  );
}

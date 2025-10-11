import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type { Locale } from "@/lib/i18n/locales";
import type { Category } from "@/lib/posts";
import { getTranslation } from "@/lib/i18n/translations";

interface LanguageNoticeProps {
  locale: Locale;
  chinesePostCount: number;
  category?: Category;
}

export function LanguageNotice({
  locale,
  chinesePostCount,
  category = undefined,
}: LanguageNoticeProps) {
  const t = getTranslation(locale);

  // Only show for non-Chinese locales
  if (locale === 'zh') {
    return null;
  }

  // Generate link path based on category
  const targetPath = category ? `/${category}` : '/posts';
  const fullPath = `/zh${targetPath}`;

  // Use correct punctuation based on locale
  const period = locale === 'en' ? '.' : '。';

  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription>
        {t.languageNotice.mainlyInChinese}{period}
        {t.languageNotice.currentlyHas} {chinesePostCount} {t.languageNotice.articles}{period}
        <Link href={fullPath} className="underline ml-1">
          {t.languageNotice.switchToChinese}
        </Link>
        {period}
      </AlertDescription>
    </Alert>
  );
}

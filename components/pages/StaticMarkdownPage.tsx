import path from "path";
import { access } from "fs/promises";
import MarkdownPage from "@/components/MarkdownPage";
import Navbar from "@/components/Navbar";
import type { Locale } from "@/lib/i18n/locales";

export async function StaticMarkdownPage({
  pageName,
  locale,
}: {
  pageName: string;
  locale: Locale;
}) {
  // Try to find locale-specific markdown file, fallback to default (Chinese)
  const localeFilename = locale === 'zh' ? `${pageName}.md` : `${pageName}.${locale}.md`;
  const localePath = path.join(process.cwd(), `public/pages/${localeFilename}`);

  // Check if the locale-specific file exists, if not fallback to Chinese version
  let filepath = localePath;
  if (locale !== 'zh') {
    try {
      await access(localePath);
    } catch {
      // File doesn't exist, fallback to Chinese version
      filepath = path.join(process.cwd(), `public/pages/${pageName}.md`);
    }
  }

  return (
    <>
      <Navbar locale={locale} category={null} />
      <MarkdownPage filepath={filepath} locale={locale} />
    </>
  );
}

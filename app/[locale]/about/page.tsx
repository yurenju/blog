import { StaticMarkdownPage } from "@/components/pages/StaticMarkdownPage";
import type { Locale } from "@/lib/i18n/locales";

export default async function LocaleAboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <StaticMarkdownPage pageName="about" locale={locale} />;
}

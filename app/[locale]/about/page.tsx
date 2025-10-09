import { StaticMarkdownPage } from "@/components/pages/StaticMarkdownPage";
import type { Locale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/metadata";
import { getTranslation } from "@/lib/i18n/translations";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getTranslation(locale);
  return generatePageMetadata(locale, '/about', t.nav.about);
}

export default async function LocaleAboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <StaticMarkdownPage pageName="about" locale={locale} />;
}

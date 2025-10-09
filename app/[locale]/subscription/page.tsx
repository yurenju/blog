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
  return generatePageMetadata(locale, '/subscription', t.nav.subscription);
}

export default async function LocaleSubscriptionPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <StaticMarkdownPage pageName="subscription" locale={locale} />;
}

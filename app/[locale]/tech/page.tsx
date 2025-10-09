import { CategoryPage } from "@/components/pages/CategoryPage";
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
  return generatePageMetadata(locale, '/tech', t.categories.tech);
}

export default async function LocaleTechPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <CategoryPage category="tech" locale={locale} />;
}

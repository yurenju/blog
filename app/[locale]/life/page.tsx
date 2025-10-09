import { CategoryPage } from "@/components/pages/CategoryPage";
import type { Locale } from "@/lib/i18n/locales";

export default async function LocaleLifePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <CategoryPage category="life" locale={locale} />;
}

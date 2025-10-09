import { CategoryPage } from "@/components/pages/CategoryPage";
import type { Locale } from "@/lib/i18n/locales";

export default async function LocaleTechPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <CategoryPage category="tech" locale={locale} />;
}

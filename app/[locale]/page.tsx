import { HomePage } from "@/components/pages/HomePage";
import type { Locale } from "@/lib/i18n/locales";

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <HomePage locale={locale} />;
}

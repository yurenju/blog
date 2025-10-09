import { HomePage } from "@/components/pages/HomePage";
import type { Locale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata(locale, '');
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <HomePage locale={locale} />;
}

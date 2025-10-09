import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/locales";
import { siteConfig } from "@/lib/siteConfig";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  await params;

  return {
    title: siteConfig.title,
    description: siteConfig.description,
    alternates: {
      languages: {
        'zh-Hant': `${siteConfig.link}/zh`,
        'ja': `${siteConfig.link}/ja`,
        'en': `${siteConfig.link}/en`,
        'x-default': `${siteConfig.link}/zh`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  // Nested layout should not render html/body tags
  // Those are handled by the root app/layout.tsx
  return <>{children}</>;
}

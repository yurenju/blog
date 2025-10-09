import type { Metadata, Viewport } from "next";
import { locales, htmlLangMap, type Locale } from "@/lib/i18n/locales";
import { siteConfig } from "@/lib/siteConfig";
import { RootLayoutContent } from "@/components/RootLayoutContent";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "width=device-width, initial-scale=1.0",
};

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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  const htmlLang = htmlLangMap[locale];

  return (
    <RootLayoutContent locale={locale} htmlLang={htmlLang}>
      {children}
    </RootLayoutContent>
  );
}

import { PostsPage } from "@/components/pages/PostsPage";
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
  return generatePageMetadata(locale, '/posts', t.nav.allPosts);
}

export default async function LocalePostsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <PostsPage locale={locale} />;
}

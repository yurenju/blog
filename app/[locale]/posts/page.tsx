import { PostsPage } from "@/components/pages/PostsPage";
import type { Locale } from "@/lib/i18n/locales";

export default async function LocalePostsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <PostsPage locale={locale} />;
}

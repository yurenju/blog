import { getPostsByLocale, getPostCountByLocale } from "@/lib/posts";
import PostsList from "@/components/PostsList";
import { LanguageNotice } from "@/components/LanguageNotice";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locales";

export async function PostsPage({ locale }: { locale: Locale }) {
  const t = getTranslation(locale);
  const posts = await getPostsByLocale(locale);
  const chinesePostCount = await getPostCountByLocale('zh');

  return (
    <div className="container mx-auto p-4">
      <PostsList posts={posts} title={t.nav.allPosts} locale={locale} />
      <LanguageNotice locale={locale} chinesePostCount={chinesePostCount} />
    </div>
  );
}

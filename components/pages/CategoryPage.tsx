import { fetchCategoryPosts, getPostCountByLocale, type Category } from "@/lib/posts";
import PostsList from "@/components/PostsList";
import { LanguageNotice } from "@/components/LanguageNotice";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locales";

export async function CategoryPage({
  category,
  locale,
}: {
  category: Category;
  locale: Locale;
}) {
  const t = getTranslation(locale);
  const posts = await fetchCategoryPosts(category, locale);
  const title = t.categories[category];
  const chinesePostCount = await getPostCountByLocale('zh');

  return (
    <div className="container mx-auto p-4">
      <PostsList posts={posts} title={title} locale={locale} />
      <LanguageNotice locale={locale} chinesePostCount={chinesePostCount} />
    </div>
  );
}

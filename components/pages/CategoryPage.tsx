import { fetchCategoryPosts, getPostCountByCategoryAndLocale, type Category } from "@/lib/posts";
import PostsList from "@/components/PostsList";
import { LanguageNotice } from "@/components/LanguageNotice";
import { getTranslation } from "@/lib/i18n/translations";
import Navbar from "@/components/Navbar";
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
  const chinesePostCount = await getPostCountByCategoryAndLocale(category, 'zh');

  return (
    <>
      <Navbar locale={locale} category={category} />
      <div className="container mx-auto p-4">
        <PostsList posts={posts} title={title} locale={locale} />
        <LanguageNotice locale={locale} chinesePostCount={chinesePostCount} category={category} />
      </div>
    </>
  );
}

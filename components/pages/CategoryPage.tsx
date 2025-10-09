import { fetchCategoryPosts, type Category } from "@/lib/posts";
import PostsList from "@/components/PostsList";
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
  const posts = await fetchCategoryPosts(category);
  const title = t.categories[category];

  return (
    <div className="container mx-auto p-4">
      <PostsList posts={posts} title={title} locale={locale} />
    </div>
  );
}

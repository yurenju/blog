import { getArchivedPostsByLocale, fetchArchivedCategoryPosts, getPostCountByLocale, getPostCountByCategoryAndLocale, type Category } from "@/lib/posts";
import PostsList from "@/components/PostsList";
import { LanguageNotice } from "@/components/LanguageNotice";
import { getTranslation } from "@/lib/i18n/translations";
import Navbar from "@/components/Navbar";
import type { Locale } from "@/lib/i18n/locales";

export async function ArchivesPage({ locale, category }: { locale: Locale; category?: Category }) {
  const t = getTranslation(locale);

  const posts = category
    ? await fetchArchivedCategoryPosts(category, locale)
    : await getArchivedPostsByLocale(locale);

  const title = category
    ? `${t.archives.title} - ${t.categories[category]}`
    : t.archives.title;

  const chinesePostCount = category
    ? await getPostCountByCategoryAndLocale(category, 'zh')
    : await getPostCountByLocale('zh');

  return (
    <>
      <Navbar locale={locale} category={category ?? null} />
      <div className="container mx-auto p-4">
        <PostsList posts={posts} title={title} locale={locale} />
        <LanguageNotice locale={locale} chinesePostCount={chinesePostCount} category={category} />
      </div>
    </>
  );
}

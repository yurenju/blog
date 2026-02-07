import Link from "next/link";
import { getPostsByLocale, getPostCountByLocale } from "@/lib/posts";
import PostsList from "@/components/PostsList";
import { LanguageNotice } from "@/components/LanguageNotice";
import { getTranslation } from "@/lib/i18n/translations";
import Navbar from "@/components/Navbar";
import type { Locale } from "@/lib/i18n/locales";

export async function PostsPage({ locale }: { locale: Locale }) {
  const t = getTranslation(locale);
  const posts = await getPostsByLocale(locale);
  const chinesePostCount = await getPostCountByLocale('zh');

  return (
    <>
      <Navbar locale={locale} category={null} />
      <div className="container mx-auto p-4">
        <PostsList posts={posts} title={t.nav.allPosts} locale={locale} />
        <div className="mt-8 mb-12 text-center">
          <Link
            href={`/${locale}/archives`}
            className="text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            {t.archives.viewArchived}
          </Link>
        </div>
        <LanguageNotice locale={locale} chinesePostCount={chinesePostCount} />
      </div>
    </>
  );
}

import { decodeSlug, getPostData, getSingletonPostMetadata } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { formatDate } from "@/lib/utils";
import { getTranslation } from "@/lib/i18n/translations";
import { ArticleLanguageIndicator } from "@/components/ArticleLanguageIndicator";
import Navbar from "@/components/Navbar";
import type { Locale } from "@/lib/i18n/locales";

export async function PostDetailPage({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const t = getTranslation(locale);
  const allPostMetadata = await getSingletonPostMetadata();
  const decodedSlug = decodeSlug(slug);
  // For non-zh locales, the key format is `${slug}-${locale}`
  const postKey = locale === 'zh' ? decodedSlug : `${decodedSlug}-${locale}`;
  const postData = await getPostData(allPostMetadata[postKey].filePath);

  const mainCategory = postData.categories[0] || null;

  return (
    <>
      <Navbar locale={locale} category={mainCategory} />
      <div className="container mx-auto p-4">
      <h1 className="font-serif text-4xl font-bold mb-6">
        {postData.title}
      </h1>
      <ArticleLanguageIndicator
        availableLocales={postData.availableLocales}
        currentLocale={locale}
        slug={slug}
      />
      <article
        className="prose prose-lg zh:prose-zh ja:prose-ja dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: postData.content }}
      />
      <div className="font-serif text-sm text-muted-foreground text-right mt-8">
        ⸺ {siteConfig.author.name} {t.post.writtenBy}{" "}
        {formatDate(postData.date, { withYear: true, locale })}
      </div>
      </div>
    </>
  );
}

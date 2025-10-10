import { decodeSlug, getPostData, getSingletonPostMetadata } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { formatDate } from "@/lib/utils";
import { getTranslation } from "@/lib/i18n/translations";
import { ArticleLanguageIndicator } from "@/components/ArticleLanguageIndicator";
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold">
        {postData.title}
      </h1>
      <ArticleLanguageIndicator
        availableLocales={postData.availableLocales}
        currentLocale={locale}
        slug={slug}
      />
      <div
        className="article"
        dangerouslySetInnerHTML={{ __html: postData.content }}
      />
      <p>
        ⸺ {siteConfig.author.name} {t.post.writtenBy}{" "}
        {formatDate(postData.date, { withYear: true, locale })}
      </p>
    </div>
  );
}

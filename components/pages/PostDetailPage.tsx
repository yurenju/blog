import { decodeSlug, getPostData, getSingletonPostMetadata } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { formatDate } from "@/lib/utils";
import { Noto_Serif_TC } from "next/font/google";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locales";

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
});

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
  const postData = await getPostData(allPostMetadata[decodedSlug].filePath);

  return (
    <div className="container mx-auto p-4 mb-48">
      <h1 className="article-title text-3xl font-semibold mb-6">
        {postData.title}
      </h1>
      <div
        className="article font-light text-lg leading-10 md:leading-relaxed text-justify"
        dangerouslySetInnerHTML={{ __html: postData.content }}
      />
      <p
        className={`text-gray-400 dark:text-gray-500 text-right mt-6 ${notoSerifTC.className}`}
      >
        ⸺ {siteConfig.author.name} {t.post.writtenBy}{" "}
        {formatDate(postData.date, { withYear: true })}
      </p>
    </div>
  );
}

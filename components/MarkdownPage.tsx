import { getPostData } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { formatDate } from "@/lib/utils";
import { getTranslation } from "@/lib/i18n/translations";
import { Noto_Serif_TC } from "next/font/google";
import type { Locale } from "@/lib/i18n/locales";

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
});

type MarkdownPageProps = {
  filepath: string;
  showAuthor?: boolean;
  showDate?: boolean;
  locale: Locale;
};

export default async function MarkdownPage({
  filepath,
  showAuthor = true,
  showDate = true,
  locale,
}: MarkdownPageProps) {
  const pageData = await getPostData(filepath);
  const t = getTranslation(locale);

  return (
    <div className="container mx-auto p-4 mb-48">
      <h1 className="article-title text-3xl font-semibold mb-6">
        {pageData.title}
      </h1>
      <div
        className="article font-light text-lg leading-10 md:leading-loose text-justify"
        dangerouslySetInnerHTML={{ __html: pageData.content }}
      />
      {(showAuthor || showDate) && (
        <p
          className={`text-gray-400 dark:text-gray-500 text-right mt-6 ${notoSerifTC.className}`}
        >
          {showAuthor && (
            <>
              ⸺ {siteConfig.author.name}
              {showDate && ` ${t.post.writtenBy} `}
            </>
          )}
          {showDate && formatDate(pageData.date, { withYear: true, locale })}
        </p>
      )}
    </div>
  );
}

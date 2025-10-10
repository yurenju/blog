import { getPostData } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { formatDate } from "@/lib/utils";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locales";

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold">
        {pageData.title}
      </h1>
      <div
        className="article"
        dangerouslySetInnerHTML={{ __html: pageData.content }}
      />
      {(showAuthor || showDate) && (
        <p>
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

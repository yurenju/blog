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
      <h1 className="font-serif text-4xl font-bold mb-6">
        {pageData.title}
      </h1>
      <article
        className="prose prose-lg zh:prose-zh ja:prose-ja dark:prose-invert max-w-none prose-blockquote:font-serif"
        dangerouslySetInnerHTML={{ __html: pageData.content }}
      />
      {(showAuthor || showDate) && (
        <div className="font-serif text-sm text-muted-foreground text-right mt-8">
          {showAuthor && (
            <>
              ⸺ {siteConfig.author.name}
              {showDate && ` ${t.post.writtenBy} `}
            </>
          )}
          {showDate && formatDate(pageData.date, { withYear: true, locale })}
        </div>
      )}
    </div>
  );
}

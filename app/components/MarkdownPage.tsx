import { getPostData } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { formatDate } from "@/lib/utils";
import { Noto_Serif_TC } from "next/font/google";

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
});

type MarkdownPageProps = {
  filepath: string;
  showAuthor?: boolean;
  showDate?: boolean;
};

export default async function MarkdownPage({
  filepath,
  showAuthor = true,
  showDate = true,
}: MarkdownPageProps) {
  const pageData = await getPostData(filepath);

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
              {showDate && " 撰於 "}
            </>
          )}
          {showDate && formatDate(pageData.date, { withYear: true })}
        </p>
      )}
    </div>
  );
}

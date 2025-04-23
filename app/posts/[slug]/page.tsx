import { decodeSlug, getPostData, getSingletonPostMetadata } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import { Noto_Serif_TC } from "next/font/google";

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
});

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allPostMetadata = await getSingletonPostMetadata();
  const decodedSlug = decodeSlug(slug);
  const postData = await getPostData(allPostMetadata[decodedSlug].filePath);

  return (
    <>
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
          ⸺ {siteConfig.author.name} 撰於{" "}
          {formatDate(postData.date, { withYear: true })}
        </p>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const allPostMetadata = await getSingletonPostMetadata();
  return Object.keys(allPostMetadata).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const allPostMetadata = await getSingletonPostMetadata();
  const decodedSlug = decodeSlug(slug);
  const postData = await getPostData(allPostMetadata[decodedSlug].filePath);

  return {
    title: `${postData.title}`,
    description: postData.description,
    openGraph: {
      title: `${postData.title}`,
      description: postData.description,
      url: `${siteConfig.link}/posts/${decodedSlug}`,
      type: "article",
      ...(postData.coverImage && {
        images: {
          url: `${siteConfig.link}/posts/${decodedSlug}/cover.jpg`,
          width: postData.coverImage.width,
          height: postData.coverImage.height,
        },
      }),
    },
    twitter: {
      title: `${postData.title}`,
      description: postData.description,
      ...(postData.coverImage && {
        images: {
          url: `${siteConfig.link}/posts/${decodedSlug}/cover.jpg`,
          width: postData.coverImage.width,
          height: postData.coverImage.height,
        },
      }),
    },
  };
}

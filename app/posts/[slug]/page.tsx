import { redirect } from "next/navigation";
import { decodeSlug, getPostData, getSingletonPostMetadata } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { Metadata } from "next";
import path from "path";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/zh/posts/${slug}`);
}

export async function generateStaticParams() {
  const allPostMetadata = await getSingletonPostMetadata();
  // Only generate params for Chinese posts (postKey without language suffix)
  return Object.keys(allPostMetadata)
    .filter((postKey) => !postKey.match(/-(?:ja|en)$/))
    .map((slug) => ({ slug }));
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
          url: `${siteConfig.link}/posts/${decodedSlug}/cover${path.extname(
            postData.coverImage.path
          )}`,
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
          url: `${siteConfig.link}/posts/${decodedSlug}/cover${path.extname(
            postData.coverImage.path
          )}`,
          width: postData.coverImage.width,
          height: postData.coverImage.height,
        },
      }),
    },
  };
}

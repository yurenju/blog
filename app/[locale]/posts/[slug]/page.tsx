import { decodeSlug, getPostData, getSingletonPostMetadata } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { Metadata } from "next";
import path from "path";
import { PostDetailPage } from "@/components/pages/PostDetailPage";
import type { Locale } from "@/lib/i18n/locales";

export default async function LocalePostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  return <PostDetailPage slug={slug} locale={locale} />;
}

export async function generateStaticParams() {
  const allPostMetadata = await getSingletonPostMetadata();
  return Object.keys(allPostMetadata).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const allPostMetadata = await getSingletonPostMetadata();
  const decodedSlug = decodeSlug(slug);
  const postData = await getPostData(allPostMetadata[decodedSlug].filePath);

  return {
    title: `${postData.title}`,
    description: postData.description,
    openGraph: {
      title: `${postData.title}`,
      description: postData.description,
      url: `${siteConfig.link}/${locale}/posts/${decodedSlug}`,
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

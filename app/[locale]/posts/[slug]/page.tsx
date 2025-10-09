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
  const params: { locale: Locale; slug: string }[] = [];

  for (const [postKey, metadata] of Object.entries(allPostMetadata)) {
    // postKey format: "slug" for zh, "slug-locale" for other locales
    if (postKey.endsWith('-ja')) {
      params.push({ locale: 'ja', slug: metadata.slug });
    } else if (postKey.endsWith('-en')) {
      params.push({ locale: 'en', slug: metadata.slug });
    } else if (!postKey.endsWith('-ja') && !postKey.endsWith('-en')) {
      // This is a zh post (no locale suffix)
      params.push({ locale: 'zh', slug: metadata.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const allPostMetadata = await getSingletonPostMetadata();
  const decodedSlug = decodeSlug(slug);
  // For non-zh locales, the key format is `${slug}-${locale}`
  const postKey = locale === 'zh' ? decodedSlug : `${decodedSlug}-${locale}`;
  const postData = await getPostData(allPostMetadata[postKey].filePath);

  // Build hreflang alternates based on available locales
  const languages: Record<string, string> = {};
  const localeToHreflang: Record<Locale, string> = {
    zh: 'zh-Hant',
    ja: 'ja',
    en: 'en',
  };

  for (const availableLocale of postData.availableLocales) {
    const prefix = availableLocale === 'zh' ? '' : `/${availableLocale}`;
    languages[localeToHreflang[availableLocale]] = `${siteConfig.link}${prefix}/posts/${decodedSlug}`;
  }
  languages['x-default'] = `${siteConfig.link}/posts/${decodedSlug}`;

  return {
    title: `${postData.title}`,
    description: postData.description,
    alternates: {
      languages,
    },
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

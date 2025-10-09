import { getSingletonPostMetadata, getPostData } from "@/lib/posts";
import PostsList from "@/components/PostsList";
import type { Locale } from "@/lib/i18n/locales";

export async function PostsPage({ locale }: { locale: Locale }) {
  const allPostMetadata = await getSingletonPostMetadata();
  const posts = await Promise.all(
    Object.values(allPostMetadata).map((post) => getPostData(post.filePath))
  );

  return (
    <div className="container mx-auto p-4">
      <PostsList posts={posts} locale={locale} />
    </div>
  );
}

import { getSingletonPostMetadata, getPostData } from "@/lib/posts";
import PostsList from "@/app/components/PostsList";

export default async function PostsPage() {
  const allPostMetadata = await getSingletonPostMetadata();
  const posts = await Promise.all(
    Object.values(allPostMetadata).map((post) => getPostData(post.filePath))
  );

  return (
    <div className="container mx-auto p-4">
      <PostsList posts={posts} />
    </div>
  );
}

import { getSingletonPostMetadata, getPostData } from "../../lib/posts";

export default async function PostsPage() {
  const allPostMetadata = await getSingletonPostMetadata();
  const posts = await Promise.all(
    Object.values(allPostMetadata).map((post) => getPostData(post.filePath))
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="mb-2">
            <a
              href={`/posts/${post.slug}`}
              className="text-blue-500 hover:underline"
            >
              {post.title}
            </a>
            <span className="text-gray-500 ml-2">{post.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

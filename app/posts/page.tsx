import { getSingletonPostMetadata, getPostData } from "../../lib/posts";

export default async function PostsPage() {
  const allPostMetadata = await getSingletonPostMetadata();
  const posts = await Promise.all(
    Object.values(allPostMetadata).map((post) => getPostData(post.filePath))
  );

  // Sort posts by date in descending order
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

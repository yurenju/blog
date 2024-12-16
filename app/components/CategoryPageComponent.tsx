import Link from "next/link";

type Post = {
  slug: string;
  title: string;
};

type CategoryPageComponentProps = {
  category: string;
  posts: Post[];
};

export const CategoryPageComponent = ({
  category,
  posts,
}: CategoryPageComponentProps) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{category} Articles</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${post.slug}`}
              className="text-blue-500 hover:underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

import Link from "next/link";
import { formatDate } from "@/lib/utils";

type Post = {
  slug: string;
  title: string;
  date: string;
};

type GroupedPosts = {
  [year: string]: Post[];
};

type PostsListProps = {
  posts: Post[];
  title?: string;
  showTitle?: boolean;
};

const groupPostsByYear = (posts: Post[]): GroupedPosts => {
  return posts.reduce((groups: GroupedPosts, post) => {
    const year = new Date(post.date).getFullYear().toString();
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(post);
    return groups;
  }, {});
};

const PostsList = ({
  posts,
  title = "全部文章",
  showTitle = true,
}: PostsListProps) => {
  // Sort posts by date in descending order
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group posts by year
  const groupedPosts = groupPostsByYear(sortedPosts);
  const years = Object.keys(groupedPosts).sort((a, b) => b.localeCompare(a));

  return (
    <div className="w-full">
      {showTitle && <h1 className="text-2xl font-bold mb-8">{title}</h1>}
      {years.map((year) => (
        <div key={year} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{year} 年</h2>
          <ul className="text-lg">
            {groupedPosts[year].map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${encodeURIComponent(post.slug)}`}
                  className="flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 pl-3 mb-2 rounded-lg transition-colors"
                  tabIndex={0}
                  aria-label={`閱讀文章: ${post.title}`}
                >
                  <span className="text-gray-500 text-sm min-w-[80px] text-center">
                    {formatDate(post.date, { withYear: false })}
                  </span>
                  <span className="text-blue-600 group-hover:text-blue-700">
                    {post.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PostsList;

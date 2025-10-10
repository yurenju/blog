import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/locales";

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
  locale: Locale;
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
  title,
  showTitle = true,
  locale,
}: PostsListProps) => {
  const prefix = locale === 'zh' ? '' : `/${locale}`;

  // Sort posts by date in descending order
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group posts by year
  const groupedPosts = groupPostsByYear(sortedPosts);
  const years = Object.keys(groupedPosts).sort((a, b) => b.localeCompare(a));

  // Format year display based on locale
  const formatYearDisplay = (year: string) => {
    if (locale === 'zh') return `${year} 年`;
    if (locale === 'ja') return `${year}年`;
    return year;
  };

  return (
    <div className="w-full">
      {showTitle && title && (
        <h1 className="font-serif text-4xl font-bold mb-12">
          {title}
        </h1>
      )}
      {years.map((year) => (
        <div key={year} className="mb-12">
          <h2 className="font-serif text-2xl font-semibold mb-6 text-foreground/80">
            {formatYearDisplay(year)}
          </h2>
          <ul className="space-y-3">
            {groupedPosts[year].map((post) => (
              <li key={post.slug}>
                <Link
                  href={`${prefix}/posts/${encodeURIComponent(post.slug)}`}
                  className="flex items-baseline gap-4 group hover:text-primary transition-colors"
                  tabIndex={0}
                  aria-label={locale === 'zh' ? `閱讀文章: ${post.title}` :
                             locale === 'ja' ? `記事を読む: ${post.title}` :
                             `Read article: ${post.title}`}
                >
                  <span className="text-sm text-muted-foreground min-w-[80px]">
                    {formatDate(post.date, { withYear: false, locale })}
                  </span>
                  <span className="flex-1 group-hover:underline underline-offset-4">
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

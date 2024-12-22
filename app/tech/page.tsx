import { fetchCategoryPosts } from "@/lib/posts";
import PostsList from "../components/PostsList";

const TechPage = async () => {
  const posts = await fetchCategoryPosts("tech");
  return (
    <div className="container mx-auto p-4">
      <PostsList posts={posts} title="科技" />
    </div>
  );
};

export default TechPage;

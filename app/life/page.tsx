import { fetchCategoryPosts } from "@/lib/posts";
import PostsList from "../components/PostsList";

const LifePage = async () => {
  const posts = await fetchCategoryPosts("life");
  return (
    <div className="container mx-auto p-4">
      <PostsList posts={posts} title="生活" />
    </div>
  );
};

export default LifePage;

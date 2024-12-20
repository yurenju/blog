import { fetchCategoryPosts } from "@/lib/posts";
import PostsList from "../components/PostsList";

const ShortsPage = async () => {
  const posts = await fetchCategoryPosts("shorts");
  return (
    <div className="container mx-auto p-4">
      <PostsList posts={posts} title="照片與短文" />
    </div>
  );
};

export default ShortsPage;

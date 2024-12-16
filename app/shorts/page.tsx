import { fetchCategoryPosts } from "@/lib/posts";
import { CategoryPageComponent } from "../components/CategoryPageComponent";

const ShortsPage = async () => {
  const posts = await fetchCategoryPosts("shorts");
  return <CategoryPageComponent category="Shorts" posts={posts} />;
};

export default ShortsPage;

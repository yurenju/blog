import { fetchCategoryPosts } from "@/lib/posts";
import { CategoryPageComponent } from "../components/CategoryPageComponent";

const LifePage = async () => {
  const posts = await fetchCategoryPosts("life");
  return <CategoryPageComponent category="Life" posts={posts} />;
};

export default LifePage;

import { fetchCategoryPosts } from "@/lib/posts";
import { CategoryPageComponent } from "../components/CategoryPageComponent";

const TechPage = async () => {
  const posts = await fetchCategoryPosts("tech");
  return <CategoryPageComponent category="Tech" posts={posts} />;
};

export default TechPage;

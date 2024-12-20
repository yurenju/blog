import path from "path";
import MarkdownPage from "@/app/components/MarkdownPage";

export default async function AboutPage() {
  const filepath = path.join(process.cwd(), "public/pages/about.md");

  return <MarkdownPage filepath={filepath} />;
}

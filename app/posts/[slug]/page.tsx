import {
  decodeSlug,
  getPostData,
  getSingletonPostMetadata,
} from "../../../lib/posts";
import { remark } from "remark";
import html from "remark-html";
import { remarkImagePath } from "../../../lib/image";
import path from "path";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allPostMetadata = await getSingletonPostMetadata();
  const decodedSlug = decodeSlug(slug);
  const postData = await getPostData(allPostMetadata[decodedSlug].filePath);

  // Extract the directory of the markdown file
  const markdownDir = path.dirname(allPostMetadata[decodedSlug].filePath);

  // Process markdown content to HTML with image path correction
  const processedContent = await remark()
    .use(html)
    .use(remarkImagePath(markdownDir))
    .process(postData.content);
  const contentHtml = processedContent.toString();

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{postData.title}</h1>
        <p className="text-gray-500">{postData.date}</p>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const allPostMetadata = await getSingletonPostMetadata();
  return Object.keys(allPostMetadata).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allPostMetadata = await getSingletonPostMetadata();
  const decodedSlug = decodeSlug(slug);
  const postData = await getPostData(allPostMetadata[decodedSlug].filePath);

  return {
    title: `${postData.title} - Yuren`,
  };
}

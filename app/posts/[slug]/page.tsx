import {
  decodeSlug,
  getPostData,
  getSingletonPostMetadata,
} from "../../../lib/posts";
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allPostMetadata = await getSingletonPostMetadata();
  const decodedSlug = decodeSlug(slug);
  const postData = await getPostData(allPostMetadata[decodedSlug].filePath);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{postData.title}</h1>
      <p className="text-gray-500">{postData.date}</p>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </div>
  );
}

export async function generateStaticParams() {
  const allPostMetadata = await getSingletonPostMetadata();
  return Object.keys(allPostMetadata).map((slug) => ({ slug }));
}

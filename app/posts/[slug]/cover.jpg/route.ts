import { getSingletonPostMetadata, getPostData } from "@/lib/posts";
import fs from "fs";

export async function generateStaticParams() {
  const allPostMetadata = await getSingletonPostMetadata();
  return Object.keys(allPostMetadata).map((slug) => ({ slug }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const allPostMetadata = await getSingletonPostMetadata();
    const postMetadata = allPostMetadata[slug];

    if (!postMetadata) {
      return new Response("Post not found", { status: 404 });
    }

    const postData = await getPostData(postMetadata.filePath);

    if (!postData.coverImage) {
      return new Response("No cover image found", { status: 404 });
    }

    const imageBuffer = await fs.promises.readFile(postData.coverImage);

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating cover image:", error);
    return new Response("Error generating cover image", { status: 500 });
  }
}

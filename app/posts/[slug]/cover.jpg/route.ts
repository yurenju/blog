import { getSingletonPostMetadata, getPostData } from "@/lib/posts";
import fs from "fs";
import sharp from "sharp";
import { calculateResizedDimensions } from "@/lib/image";

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

    let imageBuffer = await fs.promises.readFile(postData.coverImage.path);
    const { originalWidth, originalHeight } = postData.coverImage;

    const { width, height } = calculateResizedDimensions(
      originalWidth,
      originalHeight
    );

    if (width !== originalWidth || height !== originalHeight) {
      imageBuffer = await sharp(imageBuffer)
        .resize(width, height, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toBuffer();
    }

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

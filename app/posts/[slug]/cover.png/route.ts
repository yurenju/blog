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
        .png() // 使用 PNG 格式而不是 JPEG
        .toBuffer();
    } else {
      // 如果不需要調整大小，但原始檔案不是 PNG 格式，則將其轉換為 PNG
      const metadata = await sharp(imageBuffer).metadata();
      if (metadata.format !== "png") {
        imageBuffer = await sharp(imageBuffer).png().toBuffer();
      }
    }

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png", // 設置 Content-Type 為 PNG
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating cover image:", error);
    return new Response("Error generating cover image", { status: 500 });
  }
}

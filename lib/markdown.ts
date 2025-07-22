import { remarkCustomImageSyntax } from "./image";
import { remark } from "remark";
import { remarkImagePath } from "./image";
import path from "path";
import { Plugin } from "unified";
import { Node, Parent } from "unist";
import { visit } from "unist-util-visit";
import { Text, Image } from "mdast";
import fs from "fs";
import sharp from "sharp";
import { calculateResizedDimensions } from "./image";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

const remarkExtractText: Plugin = () => {
  return (tree: Node) => {
    const textParts: string[] = [];
    let currentParagraph: string[] = [];

    visit(
      tree,
      ["text", "heading", "paragraph"],
      (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node: any
      ) => {
        if (node.type === "text") {
          currentParagraph.push(node.value);
        } else if (node.type === "paragraph" || node.type === "heading") {
          if (currentParagraph.length > 0) {
            textParts.push(currentParagraph.join(" ").trim());
            currentParagraph = [];
          }
        }
      }
    );

    if (currentParagraph.length > 0) {
      textParts.push(currentParagraph.join(" ").trim());
    }

    (tree as Parent).children = [
      {
        type: "text",
        value: textParts.join(" ").trim(),
      } as Text,
    ];
  };
};

export const stripMarkdownToText = async (
  filePath: string,
  content: string,
  maxLength?: number
): Promise<string> => {
  const markdownDir = path.dirname(filePath);

  const result = await remark()
    .use(remarkCustomImageSyntax(markdownDir))
    .use(remarkExtractText)
    .process(content);
  const text = result.toString().trim();

  if (maxLength && text.length > maxLength) {
    return text.slice(0, maxLength) + "…";
  }

  return text;
};

export const processMarkdownContent = async (
  filePath: string,
  content: string
): Promise<string> => {
  const markdownDir = path.dirname(filePath);

  const processedContent = await remark()
    .use(remarkCustomImageSyntax(markdownDir))
    .use(remarkImagePath(markdownDir))
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: {
        dark: "github-dark",
        light: "github-light",
      },
      keepBackground: true,
    })
    .use(rehypeStringify)
    .process(content);

  return processedContent.toString();
};

interface ImageInfo {
  path: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

export const extractFirstImage = async (
  content: string,
  filePath: string
): Promise<ImageInfo | null> => {
  let firstImagePath: string | null = null;
  const markdownDir = path.dirname(filePath);
  const publicDir = path.join(process.cwd(), "public");

  const extractImagePlugin: Plugin = () => {
    return (tree: Node) => {
      visit(tree, "image", (node: Image) => {
        if (firstImagePath) return false;

        const cleanUrl = node.url.split("#")[0];

        if (cleanUrl.startsWith("http") || cleanUrl.startsWith("https")) {
          return;
        }

        const ext = path.extname(cleanUrl).toLowerCase();
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
          return;
        }

        let imagePath: string;
        if (cleanUrl.startsWith("/")) {
          const relativePath = cleanUrl.slice(1);
          imagePath = path.join(publicDir, relativePath);
        } else {
          imagePath = path.join(markdownDir, cleanUrl);
        }

        try {
          if (fs.existsSync(imagePath)) {
            firstImagePath = imagePath;
            return false;
          }
        } catch (error) {
          console.log("image not found", imagePath, error);
          return;
        }
      });
    };
  };

  await remark()
    .use(remarkCustomImageSyntax(markdownDir))
    .use(extractImagePlugin)
    .process(content);

  if (!firstImagePath) {
    return null;
  }

  try {
    const metadata = await sharp(firstImagePath).metadata();
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    const { width, height } = calculateResizedDimensions(
      originalWidth,
      originalHeight
    );

    return {
      path: firstImagePath,
      width,
      height,
      originalWidth,
      originalHeight,
    };
  } catch (error) {
    console.error("Error getting image metadata:", firstImagePath, error);
    return null;
  }
};

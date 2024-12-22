import { remarkCustomImageSyntax } from "./image";
import { remark } from "remark";
import { remarkImagePath } from "./image";
import path from "path";
import html from "remark-html";
import { Plugin } from "unified";
import { Node, Parent } from "unist";
import { visit } from "unist-util-visit";
import { Text, Image } from "mdast";
import fs from "fs";

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
    .use(html)
    .process(content);

  return processedContent.toString();
};

export const extractFirstJpegImage = async (
  content: string,
  filePath: string
): Promise<string | null> => {
  let firstJpegPath: string | null = null;
  const markdownDir = path.dirname(filePath);
  const publicDir = path.join(process.cwd(), "public");

  const extractJpegPlugin: Plugin = () => {
    return (tree: Node) => {
      visit(tree, "image", (node: Image) => {
        if (firstJpegPath) return false;

        const cleanUrl = node.url.split("#")[0];

        if (cleanUrl.startsWith("http") || cleanUrl.startsWith("https")) {
          return;
        }

        const ext = path.extname(cleanUrl).toLowerCase();
        if (ext !== ".jpg" && ext !== ".jpeg") {
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
            firstJpegPath = imagePath;
            return false;
          }
        } catch (error) {
          console.log("jpeg image not found", imagePath, error);
          return;
        }
      });
    };
  };

  await remark()
    .use(remarkCustomImageSyntax(markdownDir))
    .use(extractJpegPlugin)
    .process(content);
  return firstJpegPath;
};

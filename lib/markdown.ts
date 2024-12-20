import { remarkCustomImageSyntax } from "./image";
import { remark } from "remark";
import { remarkImagePath } from "./image";
import path from "path";
import html from "remark-html";
import { Plugin } from "unified";
import { Node, Parent } from "unist";
import { visit } from "unist-util-visit";
import { Text } from "mdast";

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
  content: string,
  maxLength?: number
): Promise<string> => {
  const result = await remark().use(remarkExtractText).process(content);
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

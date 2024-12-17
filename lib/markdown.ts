import { remarkCustomImageSyntax } from "./image";

import { remark } from "remark";
import { remarkImagePath } from "./image";
import path from "path";
import html from "remark-html";

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

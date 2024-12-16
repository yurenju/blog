import { visit } from "unist-util-visit";
import path from "path";
import fs from "fs";
import { Node, Literal, Parent } from "unist";
import { Image } from "mdast";

export function remarkCustomImageSyntax(baseDir: string) {
  return () => (tree: Node) => {
    visit(tree, "text", (node: Literal, index, parent: Parent) => {
      if (typeof index === "number") {
        const customImageRegex = /!\[\[(.+?)\]\]/g;
        let match;
        while ((match = customImageRegex.exec(node.value as string)) !== null) {
          const imageName = match[1];
          const imagePath = findImagePath(baseDir, imageName);
          if (imagePath) {
            const relativePath = path.relative(baseDir, imagePath);
            const imageNode: Image = {
              type: "image",
              url: relativePath,
              alt: imageName,
            };
            parent.children.splice(index, 1, imageNode);
          }
        }
      }
    });
  };
}

function findImagePath(baseDir: string, imageName: string): string | null {
  const files = fs.readdirSync(baseDir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(baseDir, file.name);
    if (file.isDirectory()) {
      const result = findImagePath(filePath, imageName);
      if (result) return result;
    } else if (file.isFile() && file.name === imageName) {
      return filePath;
    }
  }
  return null;
}

export function remarkImagePath(baseDir: string) {
  return () => (tree: Node) => {
    visit(tree, "image", (node: Image) => {
      if (
        node.url.startsWith("/") ||
        node.url.startsWith("http") ||
        node.url.startsWith("https")
      ) {
        return;
      }
      const absolutePath = path.join(baseDir, node.url);
      const publicIndex = absolutePath.lastIndexOf("public");
      if (publicIndex !== -1) {
        node.url = absolutePath.substring(publicIndex + "public".length);
      }
    });
  };
}

import { visit } from "unist-util-visit";
import path from "path";
import { Node } from "unist";
import { Image } from "mdast";

export function remarkImagePath(baseDir: string) {
  return () => (tree: Node) => {
    visit(tree, "image", (node: Image) => {
      // Check if the URL is not an external link
      if (!node.url.startsWith("http") && !node.url.startsWith("https")) {
        // Generate the absolute path based on the public directory
        const absolutePath = path.join(baseDir, node.url);
        // Find the last occurrence of 'public' in the path
        const publicIndex = absolutePath.lastIndexOf("public");
        if (publicIndex !== -1) {
          // Remove the 'public' part and everything before it from the path
          node.url = absolutePath.substring(publicIndex + "public".length);
        }
      }
    });
  };
}

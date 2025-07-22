import { visit } from "unist-util-visit";
import { Node, Literal, Parent } from "unist";
import { Html } from "mdast";
import { Plugin } from "unified";

interface YouTubeNode extends Html {
  type: "html";
  value: string;
}

export const remarkYouTubeEmbed: Plugin = () => {
  return (tree: Node) => {
    const nodesToReplace: Array<{
      parent: Parent;
      index: number;
      node: YouTubeNode;
    }> = [];

    // First pass: collect nodes to replace
    visit(tree, "paragraph", (node: Parent, index, parent: Parent) => {
      if (typeof index === "number" && node.children.length === 1) {
        const child = node.children[0];
        
        // Check for !youtube[VIDEO_ID] or !youtube[URL] syntax
        if (child.type === "text") {
          const textNode = child as Literal;
          const text = String(textNode.value).trim();
          const youtubeRegex = /^!youtube\[(.+?)\]$/;
          const match = youtubeRegex.exec(text);
          
          if (match) {
            const input = match[1];
            const videoId = extractVideoId(input);
            
            if (videoId) {
              const youtubeNode: YouTubeNode = {
                type: "html",
                value: `<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`,
              };
              nodesToReplace.push({ parent, index, node: youtubeNode });
            }
          }
        }
        // Check for standalone YouTube links
        else if (child.type === "link") {
          const linkNode = child as Literal & { url: string };
          const videoId = extractVideoId(linkNode.url);
          
          if (videoId && isYouTubeUrl(linkNode.url)) {
            const youtubeNode: YouTubeNode = {
              type: "html",
              value: `<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`,
            };
            nodesToReplace.push({ parent, index, node: youtubeNode });
          }
        }
      }
    });

    // Second pass: replace nodes (in reverse order to maintain indices)
    nodesToReplace.reverse().forEach(({ parent, index, node }) => {
      parent.children.splice(index, 1, node);
    });
  };
}

function extractVideoId(input: string): string | null {
  // Handle direct video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }
  
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/.test(url);
}
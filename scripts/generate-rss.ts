import fs from "fs";
import path from "path";
import { generateRSSFeed } from "../lib/rss";

const CATEGORIES = ["all", "shorts", "life", "tech"] as const;

const generateRSSFile = async () => {
  try {
    const rssDir = path.join(process.cwd(), "public", "rss");
    if (!fs.existsSync(rssDir)) {
      fs.mkdirSync(rssDir, { recursive: true });
    }

    for (const category of CATEGORIES) {
      const rssContent = await generateRSSFeed(category);
      const outputPath =
        category === "all"
          ? path.join(process.cwd(), "public", "rss.xml")
          : path.join(process.cwd(), "public", "rss", `${category}.xml`);

      fs.writeFileSync(outputPath, rssContent);
      console.log(
        `RSS feed for ${category} generated successfully at:`,
        outputPath
      );
    }
  } catch (error) {
    console.error("Error generating RSS feeds:", error);
  }
};

generateRSSFile();

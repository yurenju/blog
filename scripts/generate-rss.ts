import fs from "fs";
import path from "path";
import { generateRSSFeed } from "../lib/rss";

const generateRSSFile = async () => {
  try {
    const rssContent = await generateRSSFeed();
    const outputPath = path.join(process.cwd(), "public", "rss.xml");
    fs.writeFileSync(outputPath, rssContent);
    console.log("RSS feed generated successfully at:", outputPath);
  } catch (error) {
    console.error("Error generating RSS feed:", error);
  }
};

generateRSSFile();

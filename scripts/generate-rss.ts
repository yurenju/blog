import fs from "fs";
import path from "path";
import { generateRSSFeed } from "../lib/rss";
import { locales, type Locale } from "../lib/i18n/locales";

const CATEGORIES = ["all", "shorts", "life", "tech"] as const;

const generateRSSFile = async () => {
  try {
    const rssDir = path.join(process.cwd(), "public", "rss");
    if (!fs.existsSync(rssDir)) {
      fs.mkdirSync(rssDir, { recursive: true });
    }

    // Generate legacy all-languages feeds (no locale parameter)
    for (const category of CATEGORIES) {
      const rssContent = await generateRSSFeed(category);
      const outputPath =
        category === "all"
          ? path.join(process.cwd(), "public", "rss.xml")
          : path.join(process.cwd(), "public", "rss", `${category}.xml`);

      fs.writeFileSync(outputPath, rssContent);
      console.log(
        `RSS feed for ${category} (all languages) generated successfully at:`,
        outputPath
      );
    }

    // Generate locale-specific feeds
    for (const locale of locales) {
      const localeDir = path.join(rssDir, locale);
      if (!fs.existsSync(localeDir)) {
        fs.mkdirSync(localeDir, { recursive: true });
      }

      for (const category of CATEGORIES) {
        const rssContent = await generateRSSFeed(category, locale);
        const outputPath =
          category === "all"
            ? path.join(rssDir, `${locale}.xml`)
            : path.join(localeDir, `${category}.xml`);

        fs.writeFileSync(outputPath, rssContent);
        console.log(
          `RSS feed for ${locale}/${category} generated successfully at:`,
          outputPath
        );
      }
    }
  } catch (error) {
    console.error("Error generating RSS feeds:", error);
  }
};

generateRSSFile();

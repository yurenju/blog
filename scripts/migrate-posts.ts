import fs from "fs";
import path from "path";

const postsDirectory = path.join(process.cwd(), "public", "posts");

const ARCHIVE_CUTOFF_YEAR = 2019;

const YEAR_GROUPS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

function getYearFromDirName(dirName: string): number | null {
  const match = dirName.match(/^(\d{4})-/);
  if (!match) return null;
  return parseInt(match[1], 10);
}

async function migratePosts() {
  const entries = await fs.promises.readdir(postsDirectory, {
    withFileTypes: true,
  });
  const postDirs = entries.filter((entry) => entry.isDirectory());

  // Categorize posts by target group
  const archivePosts: string[] = [];
  const yearPosts: Record<number, string[]> = {};
  const skipped: string[] = [];

  for (const year of YEAR_GROUPS) {
    yearPosts[year] = [];
  }

  for (const dir of postDirs) {
    const year = getYearFromDirName(dir.name);
    if (year === null) {
      skipped.push(dir.name);
      continue;
    }

    if (year <= ARCHIVE_CUTOFF_YEAR) {
      archivePosts.push(dir.name);
    } else if (yearPosts[year]) {
      yearPosts[year].push(dir.name);
    } else {
      skipped.push(dir.name);
    }
  }

  // Print migration plan
  console.log("=== Migration Plan ===\n");
  console.log(`Archives (≤${ARCHIVE_CUTOFF_YEAR}): ${archivePosts.length} posts`);
  for (const year of YEAR_GROUPS) {
    console.log(`${year}: ${yearPosts[year].length} posts`);
  }
  if (skipped.length > 0) {
    console.log(`\nSkipped (no date prefix): ${skipped.length}`);
    for (const name of skipped) {
      console.log(`  - ${name}`);
    }
  }
  console.log(
    `\nTotal: ${archivePosts.length + YEAR_GROUPS.reduce((sum, y) => sum + yearPosts[y].length, 0)} posts to migrate`
  );

  // Create group directories
  const groupDirs = ["archives", ...YEAR_GROUPS.map(String)];
  for (const groupDir of groupDirs) {
    const groupPath = path.join(postsDirectory, groupDir);
    if (!fs.existsSync(groupPath)) {
      await fs.promises.mkdir(groupPath);
      console.log(`\nCreated directory: ${groupDir}/`);
    }
  }

  // Move archive posts
  console.log(`\nMoving ${archivePosts.length} posts to archives/...`);
  for (const dirName of archivePosts) {
    const src = path.join(postsDirectory, dirName);
    const dest = path.join(postsDirectory, "archives", dirName);
    await fs.promises.rename(src, dest);
  }
  console.log(`  Done.`);

  // Move year posts
  for (const year of YEAR_GROUPS) {
    const posts = yearPosts[year];
    if (posts.length === 0) continue;
    console.log(`Moving ${posts.length} posts to ${year}/...`);
    for (const dirName of posts) {
      const src = path.join(postsDirectory, dirName);
      const dest = path.join(postsDirectory, String(year), dirName);
      await fs.promises.rename(src, dest);
    }
    console.log(`  Done.`);
  }

  console.log("\n=== Migration Complete ===");
}

migratePosts().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});

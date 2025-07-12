import { cpSync, existsSync } from "fs";
import { resolve, join } from "path";

const targetDir = process.cwd();
const templateDir = resolve(import.meta.dirname, "../templates");

const filesToCopy = ["routes.js", "layout.js", "domo.config.js"];

for (const file of filesToCopy) {
  const dest = join(targetDir, file);
  if (!existsSync(dest)) {
    cpSync(join(templateDir, file), dest);
    console.log(`✅ Created: ${file}`);
  } else {
    console.log(`⚠️  Skipped (already exists): ${file}`);
  }
}

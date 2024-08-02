import fs from "node:fs";
import path from "node:path";

export const writeFileAndFeedback = (filePath: string, content: string) => {
  fs.writeFileSync(filePath, content);
  console.log(`  📄 ${toRelativePath(filePath)}`);
};

export const toRelativePath = (filePath: string) =>
  path.relative(path.resolve(), filePath);

export const readFileSync = (filePath: string) =>
  fs.readFileSync(filePath, { encoding: "utf-8" });

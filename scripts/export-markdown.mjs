import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";

// Use Next's generated routes so Markdown URLs match the documentation slugs.
async function exportMarkdown(directory, segments = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await exportMarkdown(source, [...segments, entry.name]);
    } else if (entry.isFile()) {
      const destination = path.join(
        "out/docs",
        ...segments,
        `${entry.name}.md`,
      );
      await mkdir(path.dirname(destination), { recursive: true });
      await copyFile(source, destination);
    }
  }
}

await exportMarkdown("out/llm");

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const uploadDir = path.resolve(here, "../uploads");

export async function ensureUploadDir() {
  await fs.mkdir(uploadDir, { recursive: true });
}

export async function removeStoredFiles(names = []) {
  await Promise.all(names.map(async name => {
    // Stored names are server-generated, but still enforce a basename-only path.
    if (!name || path.basename(name) !== name) return;
    try { await fs.unlink(path.join(uploadDir, name)); } catch (error) {
      if (error.code !== "ENOENT") console.error("File cleanup failed:", error.message);
    }
  }));
}

export function getStoredPath(storedName) {
  if (!storedName || path.basename(storedName) !== storedName) return null;
  return path.join(uploadDir, storedName);
}

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const dataDirectory = path.resolve(process.cwd(), ".local-data");

async function ensureDataDirectory() {
  await mkdir(dataDirectory, { recursive: true });
}

function getFilePath(fileName) {
  return path.join(dataDirectory, fileName);
}

export async function readCollection(fileName, fallbackValue) {
  await ensureDataDirectory();

  try {
    const content = await readFile(getFilePath(fileName), "utf8");
    return JSON.parse(content);
  } catch (err) {
    if (err.code === "ENOENT") {
      return fallbackValue;
    }

    throw err;
  }
}

export async function writeCollection(fileName, value) {
  await ensureDataDirectory();
  await writeFile(getFilePath(fileName), JSON.stringify(value, null, 2), "utf8");
}
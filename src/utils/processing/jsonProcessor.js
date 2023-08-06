// jsonProcessor.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Function to read JSON data from a file and parse it.
export const readAndProcessJSON = (filePath) => {
  try {
    // Get the directory of the current module.
    const dirname = path.dirname(fileURLToPath(import.meta.url));

    // Read the file.
    const rawData = fs.readFileSync(path.resolve(dirname, filePath));

    // Parse the JSON data.
    const data = JSON.parse(rawData);

    return data;
  } catch (error) {
    console.error(
      "An error occurred while reading and processing the JSON data:",
      error
    );
  }
};

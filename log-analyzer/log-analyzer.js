import fs from "fs";
import { stat } from "fs/promises";
import readline from "readline";
import { parseLogLine } from "./parser.js";
import { analyzer, getResults } from "./analyzer.js";
import { generateReport } from "./formatter.js";

const validateInput = async (file) => {
  try {
    let metadata = await stat(file);
    if (!metadata.isFile()) {
      console.error(`Error: "${file}" is not a file`);
      process.exit(1);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`Error: File "${file}" not found`);
    } else if (error.code === "EACCES" || error.code === "EPERM") {
      console.error(`Error: Permission denied reading "${file}"`);
    } else {
      console.error("Unexpected error:", error.message);
    }
    process.exit(1);
  }
};

const readlogs = async (file) => {
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const parsed = parseLogLine(line);
    analyzer(parsed);
  }

  return getResults();
};

async function main() {
  const logfilePath = process.argv[2];
  if (!logfilePath) {
    console.error("Usage: node log-analyzer.js <logfile>");
    process.exit(2);
  }
  await validateInput(logfilePath);
  const results = await readlogs(logfilePath);

  await generateReport(results);
  console.log("Report generated successfully.");
}

main();

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

const parseArgs = () => {
  const args = process.argv.slice(2);
  let file = null;

  const options = {
    topIp: 5,
    reqPerMin: false,
    format: "md",
    output: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg.startsWith("--") && !file) {
      file = arg;
    } else if (arg == "--top-ip") {
      options.topIp = Number(args[++i]);
    } else if (arg == "--req-per-min") {
      options.reqPerMin = true;
    } else if (arg == "--format") {
      options.format = args[++i];
    } else if (arg == "--output") {
      options.output = args[++i];
    }
  }

  if (!options.output) {
    options.output = `report.${options.format}`;
  }
  return { file, options };
};

const main = async () => {
  const { file, options } = parseArgs();
  if (!file) {
    console.error("Usage: node log-analyzer.js <logfile>");
    process.exit(2);
  }
  await validateInput(file);
  const results = await readlogs(file);

  await generateReport(results, options);
  console.log("Report generated successfully.");
};

main();

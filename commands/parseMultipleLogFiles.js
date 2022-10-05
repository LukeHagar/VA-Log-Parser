import fs from "fs";
import linebyline from "linebyline";
import ora from "ora";
import cliProgress from "cli-progress";
import sortLog from "./sortLog.js";

const spinner = ora();

let files;

// create new container
const multibar = new cliProgress.MultiBar({
  format: "{duration}sec | {bar} {percentage}% | {value}/{total} Bytes",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
  stopOnComplete: true,
});

async function startParse(file) {
  const rl = linebyline(file.file);
  rl.on("line", function (line, lineCount, byteCount) {
    file.bar.update(byteCount);
    sortLog(line);
  });
  rl.on("end", function (line, lineCount, byteCount) {
    file.bar.update(file.stats.size);
  });
}

export default function parseMultipleLogFiles(logFiles) {
  spinner.succeed(`Parsing Log Files: ${logFiles}`);
  files = logFiles.map((file, index) => {
    let stats = fs.statSync(file);
    return {
      file,
      stats,
      bar: multibar.create(stats.size, 0),
      index,
    };
  });
  files.forEach((file) => {
    startParse(file);
  });
}

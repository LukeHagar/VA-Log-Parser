import fs from "fs";
import linebyline from "linebyline";
import ora from "ora";
import chalk from "chalk";
import cliProgress from "cli-progress";
import sortLog from "./sortLog.js";

const spinner = ora();
// create a new progress bar instance and use shades_classic theme
const bar1 = new cliProgress.SingleBar({
  format: "{duration}sec | {bar} {percentage}% | {value}/{total} Bytes",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
  stopOnComplete: true,
});

export default function parseLogFile(LogFile) {
  spinner.succeed(`Parsing Log File: ${LogFile}`);
  let fileStats = fs.statSync(LogFile);
  bar1.start(fileStats.size, 0, {
    speed: "N/A",
  });
  let lines;
  const rl = linebyline(LogFile);
  rl.on("line", function (line, lineCount, byteCount) {
    bar1.update(byteCount);
    sortLog(line);
    lines = lineCount;
  });
  rl.on("end", function (line, lineCount, byteCount) {
    bar1.update(fileStats.size);
    spinner.succeed(`Completed ${LogFile} / ${lines} Lines`);
  });
}

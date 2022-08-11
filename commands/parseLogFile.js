import moment from "moment";
import fs from "fs";
import ora from "ora";
import chalk from "chalk";

const spinner = ora();

function importLogFile(LogFile) {
  const allFileContents = fs.readFileSync(LogFile, "utf-8");
  return allFileContents;
}

function getLogLines(LogFile) {
  const fileLines = LogFile.split(/\r?\n/);
  return fileLines;
}

function saveParsedFile(filePath, data) {
  const outputString = JSON.stringify(data);
  fs.writeFileSync(filePath, outputString);
}

function getDateRange(timeStamps) {
  const sortedTimeStamps = timeStamps.sort((a, b) => b - a);
  const dateRange = `${moment(sortedTimeStamps[1]).format(
    "YYYY-MM-DD[T]HHmmss"
  )}_${moment(sortedTimeStamps[sortedTimeStamps.length - 1]).format(
    "YYYY-MM-DD[T]HHmmss"
  )}`;
  return dateRange;
}

function parseLoggers(uniqueLoggers, jsonArray, errors, dateRange, org) {
  for (const logger_name of uniqueLoggers) {
    let loggerArray = jsonArray.filter(
      (Obj) => Obj.logger_name === logger_name
    );
    let loggerErrorArray = errors.filter(
      (Obj) => Obj.logger_name === logger_name
    );
    let loggerFolder = `./${org}/${dateRange}/${logger_name.replaceAll(
      ".",
      "-"
    )}`;
    if (!fs.existsSync(loggerFolder)) {
      fs.mkdirSync(loggerFolder, { recursive: true });
    }
    const parsedLoggerPath = `${loggerFolder}/${logger_name.replaceAll(
      ".",
      "-"
    )}-${dateRange}.json`;
    const parsedLoggerErrorsPath = `${loggerFolder}/${logger_name.replaceAll(
      ".",
      "-"
    )}-${dateRange}-Errors.json`;

    saveParsedFile(parsedLoggerPath, loggerArray);
    if (loggerErrorArray.length > 0) {
      saveParsedFile(parsedLoggerErrorsPath, loggerErrorArray);
      console.log(chalk.yellow(`Errors found for Logger: ${logger_name}`));
    }
  }
}

export default function parseLogFile(LogFile) {
  spinner.start(`Importing Log File: ${LogFile}`);
  const wholeFile = importLogFile(LogFile);
  spinner.succeed();
  spinner.start(`Slicing Log File: ${LogFile}`);
  const fileLines = getLogLines(wholeFile);
  spinner.succeed();
  let jsonArray = [];
  let errors = [];
  let loggers = [];
  let org = null;
  let timeStamps = [];

  spinner.start(`Processing Log Lines: ${LogFile}`);
  for (const line of fileLines) {
    let jsonObjFromLine;
    try {
      jsonObjFromLine = JSON.parse(line);
    } catch {
      jsonObjFromLine = { text: line };
    }
    jsonArray.push(jsonObjFromLine);
    if (line.includes("error")) {
      errors.push(jsonObjFromLine);
    }
    if (
      jsonObjFromLine["logger_name"] !== null &&
      jsonObjFromLine["logger_name"] !== undefined
    ) {
      loggers.push(jsonObjFromLine.logger_name);
    }
    if (
      jsonObjFromLine["@timestamp"] !== null &&
      jsonObjFromLine["@timestamp"] !== undefined
    ) {
      timeStamps.push(new Date(jsonObjFromLine["@timestamp"]));
    }
    if (
      org == null &&
      jsonObjFromLine["org"] !== null &&
      jsonObjFromLine["org"] !== undefined
    ) {
      org = jsonObjFromLine.org;
    }
  }
  spinner.succeed();
  spinner.start(`Getting Unique Loggers: ${LogFile}`);
  const uniqueLoggers = Array.from(new Set(loggers));
  spinner.succeed();
  spinner.start(`Getting Date Range: ${LogFile}`);
  const dateRange = getDateRange(timeStamps);
  spinner.succeed();
  parseLoggers(uniqueLoggers, jsonArray, errors, dateRange, org);
}

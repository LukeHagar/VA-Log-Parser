import chalk from "chalk";
import fs from "fs";
import boxen from "boxen";

function importLogFile(LogFile) {
  const allFileContents = fs.readFileSync(LogFile, "utf-8");
  const fileLines = allFileContents.split(/\r?\n/);
  let jsonArray = [];
  console.log(fileLines);
  for (const line of fileLines) {
    try {
      let jsonObjFromLine = JSON.parse(line);
      jsonArray.push(jsonObjFromLine);
    } catch {
      console.log("Invalid JSON Found");
    }
  }
  return jsonArray;
}

function checkDirectory(path) {
  const stats = fs.statSync(path);
  return stats.isDirectory();
}

function saveParsedFile(filePath, data) {
  console.log(`Saving file ${filePath}`);
  const outputString = JSON.stringify(data);
  fs.writeFileSync(filePath, outputString);
}

export default function parseLogFile(LogFile) {
  console.log(checkDirectory(LogFile));
  const jsonArray = importLogFile(LogFile);
  const errors = jsonArray.filter(
    (Obj) =>
      Obj.message?.includes("error") ||
      Obj.exception?.stacktrace?.includes("error")
  );
  // console.log(jsonArray);
  // console.log(errors);
  const parsedDataPath = `${LogFile.replace(".log", "-log")}-Parsed.JSON`;
  const errorPath = `${LogFile.replace(".log", "-log")}-Parsed-Errors.JSON`;
  saveParsedFile(parsedDataPath, jsonArray);
  saveParsedFile(errorPath, errors);
}

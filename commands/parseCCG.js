import chalk from "chalk";
import fs from "fs";

function importCCG(CCGFile) {
  const allFileContents = fs.readFileSync(CCGFile, "utf-8");
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

function saveParsedFile(filePath, data) {
  console.log(`Saving file ${filePath}`);
  const outputString = JSON.stringify(data);
  fs.writeFileSync(filePath, outputString);
}

export default function parseCCG(CCGFile) {
  const jsonArray = importCCG(CCGFile);
  const errors = jsonArray.filter(
    (Obj) =>
      Obj.message?.includes("error") ||
      Obj.exception?.stacktrace?.includes("error")
  );
  console.log(jsonArray);
  console.log(errors);
  const parsedDataPath = `${CCGFile.replace(".log", "-log")}-Parsed.JSON`;
  const errorPath = `${CCGFile.replace(".log", "-log")}-Parsed-Errors.JSON`;
  saveParsedFile(parsedDataPath, jsonArray);
  saveParsedFile(errorPath, errors);
}

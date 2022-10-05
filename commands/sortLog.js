import fs from "fs";

export default async function sortLog(line) {
  try {
    const Obj = JSON.parse(line);
    const parsedLine = {
      date: new Date(Obj["@timestamp"]).toDateString(),
      error: line.includes("error") || line.includes("exception"),
      ...Obj,
    };
    let logPath;
    let folderPath;
    if (parsedLine.error) {
      folderPath = `./${parsedLine.org}/${
        parsedLine.date
      }/Errors/${parsedLine.logger_name.replaceAll(".", "-")}`;
    } else {
      folderPath = `./${parsedLine.org}/${
        parsedLine.date
      }/Everything/${parsedLine.logger_name.replaceAll(".", "-")}`;
    }
    logPath = `${folderPath}/log.json`;
    if (fs.existsSync(folderPath)) {
      fs.appendFileSync(logPath, `${JSON.stringify(parsedLine)}\n`);
    } else {
      fs.mkdirSync(folderPath, { recursive: true });
      fs.writeFileSync(logPath, `${JSON.stringify(parsedLine)}\n`);
    }
  } catch (err) {
    // console.debug(err);
  }
}

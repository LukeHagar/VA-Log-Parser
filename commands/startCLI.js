import inquirer from "inquirer";
import boxen from "boxen";
import ora from "ora";
import fs from "fs";
import parseLogFile from "./parseLogFile.js";
import chalk from "chalk";

function checkDirectory(path) {
  const stats = fs.statSync(path);
  return stats.isDirectory();
}

export default function startCLI() {
  const spinner = ora();
  console.log(
    boxen(`VA-Log-Parser`, {
      title: `Written by: Luke Hagar`,
      titleAlignment: "center",
      padding: 5,
    })
  );
  spinner.start(`Getting Current Directory`);
  const currentDirectory = process.cwd();
  spinner.succeed();
  spinner.start(`Reading Directory: ${currentDirectory}`);
  let directoryContents = fs.readdirSync(currentDirectory);
  spinner.succeed();
  inquirer
    .prompt([
      {
        type: "checkbox",
        message: "Select Log Files to Parse",
        name: "Files",
        choices: [
          new inquirer.Separator(chalk.yellow("------Folders------")),
          ...directoryContents.filter((Obj) => checkDirectory(Obj) === true),
          new inquirer.Separator(chalk.green("------Files------")),
          ...directoryContents.filter((Obj) => checkDirectory(Obj) === false),
        ],
        validate(answer) {
          if (answer.length < 1) {
            return "You must choose at least one File.";
          }

          return true;
        },
      },
    ])
    .then((answers) => {
      for (const logFile of answers.Files) {
        try {
          parseLogFile(logFile);
        } catch {}
      }
      spinner.succeed("Finished Processing Log Files");
    });
}

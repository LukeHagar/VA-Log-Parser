import inquirer from "inquirer";
import boxen from "boxen";
import ora from "ora";
import fs from "fs";

export default function startCLI() {
  console.log(
    boxen(`VA-Log-Parser`, {
      title: `Written by: Luke Hagar`,
      titleAlignment: "center",
      padding: 5,
    })
  );
  const currentDirectory = process.cwd();
  const spinner = ora(`Checking Path: ${currentDirectory}`).start();
  let directoryContents = fs.readdirSync(currentDirectory);
  spinner.succeed();
  inquirer
    .prompt([
      {
        type: "checkbox",
        message: "Select Log Files to Parse",
        name: "Files",
        choices: directoryContents,
        validate(answer) {
          if (answer.length < 1) {
            return "You must choose at least one File.";
          }

          return true;
        },
      },
    ])
    .then((answers) => {
      console.log(JSON.stringify(answers, null, "  "));
    });
  //   spinner.start("Processing File 1");
  //   spinner.succeed();
  //   spinner.start("Processing File 2");
  //   spinner.fail();
}

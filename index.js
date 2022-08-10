#! /usr/bin/env node
import { program } from "commander";
import parseLogFile from "./commands/parseLogFile.js";
import startCLI from "./commands/startCLI.js";
program
  .command("parseLogFile <Path>")
  .description("Parse the Provided CCG Log File")
  .action(parseLogFile);

program.description("Start the interactive Parser").action(startCLI);

program.parse();

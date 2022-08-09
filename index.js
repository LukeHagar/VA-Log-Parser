#! /usr/bin/env node
import { program } from "commander";
import parseCCG from "./commands/parseCCG.js";
program
  .command("parseCCG <CCGFile>")
  .description("Parse the Provided CCG Log File")
  .action(parseCCG);

program.parse();

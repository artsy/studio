import cac from "cac";
import * as generate from "../generators";

const cli = cac();

Object.keys(generate).forEach((generator) => {
  generate[generator](cli);
});

cli.option(
  "-d, --dry-run",
  "Shows what will be generated without performing the generation"
);

cli.on("command:*", () => {
  cli.outputHelp();
  process.exit(1);
});

cli.help();

cli.parse();

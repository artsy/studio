import prompts from "prompts";
import CAC from "cac/types/CAC";

export const command = (
  type: string,
  generator: (name: string, dryRun?: boolean) => Promise<any>,
  postAction?: (name: string) => void
) => (cli: CAC) =>
  cli
    .command(`${type} [name]`, `Generate a ${type}`)
    .action(async (name, { dryRun }) => {
      if (!name) {
        const response = await prompts({
          type: "text",
          name: "name",
          message: `What's the name of your ${type}?`,
        });
        name = response.name;
      }
      await generator(name, dryRun);
      if (!dryRun && postAction) {
        postAction(name);
      }
    });

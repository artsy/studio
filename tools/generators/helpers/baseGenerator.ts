import write from "write";
import { join } from "path";
import fs from "fs";
import prettier from "prettier";
import { diffLinesUnified } from "jest-diff";
import { red, green, yellow, bold } from "kleur";

const read = (file: string): Promise<string> =>
  new Promise((resolve, reject) => {
    fs.readFile(file, { encoding: "utf-8" }, (err, content) => {
      err ? reject(err) : resolve(content);
    });
  });

interface ContentOptions {
  filePath: string;
  basePath?: string;
}

/**
 * Creates a new file
 */
export interface FileGenerator {
  /**
   * Optional base path for this generator to use. Can be used
   * to override the default basePath if one is provided to the generator
   */
  basePath?: ((name: string) => string) | string;
  /**
   * The filename and prefixed path (if applicable) of the file being generated
   * */
  filePath: ((name: string) => string) | string;
  /**
   * The contents of the file to be created
   */
  content: ((name: string, options: ContentOptions) => string) | string;
}

interface FileModifierOptions {
  /** The name of the thing being generated */
  name: string;
  /** The filename and prefixed path (if applicable) of the file being generated */
  filePath: string;
  /**
   * Optional base path for this generator to use. Can be used
   * to override the default basePath if one is provided to the generator
   */
  basePath?: string;
  /**
   * The base path that's provided to the overall generator. Useful to know
   * where most of the files were intended to be written
   */
  defaultBasePath?: string;
}

/**
 * Updates an existing file
 */
export interface FileModifier {
  /**
   * Optional base path for this generator to use. Can be used
   * to override the default basePath if one is provided to the generator
   */
  basePath?: ((name: string) => string) | string;
  /**
   * The filename and prefixed path (if applicable) of the file being generated
   **/
  filePath: ((name: string) => string) | string;
  /**
   * A function that modifies the contents of the file specified by the modifier
   * and returns its new contents
   */
  modifier: (content: string, options: FileModifierOptions) => string;
}

interface GeneratorArgs {
  /**
   * Name of the thing being generated
   */
  name: string;
  /**
   * The default location to create or modify files relative to
   */
  basePath?: string;
  /**
   * A collection of objects that create new files
   */
  generators?: FileGenerator[];
  /**
   * A collection of objects that edit existing files
   */
  modifiers?: FileModifier[];
  /**
   * Whether the operation should be a no-op
   */
  dryRun?: boolean;
}
export type Generator = typeof generator;
export const generator = async ({
  name,
  basePath: defaultBasePath = "",
  generators,
  modifiers,
  dryRun,
}: GeneratorArgs) => {
  if (generators.length === 0 && modifiers.length === 0) {
    console.log(yellow("This generator does nothing, exiting"));
    return;
  }
  return Promise.all([
    ...generators.map(
      async ({ filePath, basePath = defaultBasePath, content }) => {
        basePath = typeof basePath === "string" ? basePath : basePath(name);
        filePath = typeof filePath === "string" ? filePath : filePath(name);
        content =
          typeof content === "string"
            ? content
            : content(name, { basePath, filePath });
        const displayPath = join(basePath, filePath);
        const path = join(process.cwd(), displayPath);

        const formattedContent = prettier.format(content, {
          filepath: filePath,
        });
        if (!dryRun) {
          console.log(`Creating file ${displayPath}`);
          await write(path, formattedContent);
        } else {
          console.log(bold(`WILL CREATE: ${displayPath} \n`));
          console.log(green(formattedContent));
        }
      }
    ),
    ...modifiers.map(
      async ({ filePath, basePath = defaultBasePath, modifier }) => {
        basePath = typeof basePath === "string" ? basePath : basePath(name);
        filePath = typeof filePath === "string" ? filePath : filePath(name);
        const displayPath = join(basePath, filePath);
        const path = join(process.cwd(), displayPath);

        const content = await read(path);
        const newContent = prettier.format(
          modifier(content, {
            name,
            filePath,
            basePath,
            defaultBasePath,
          }),
          { filepath: filePath }
        );
        if (!dryRun) {
          console.log(`Updating file ${displayPath}`);
          await write(path, newContent);
        } else {
          console.log(bold(`WILL MODIFY: ${displayPath}\n`));
          console.log(
            diffLinesUnified(
              content.trim().split("\n"),
              newContent.trim().split("\n"),
              {
                aAnnotation: "Original",
                aColor: red,
                bAnnotation: "Modified",
                bColor: green,
                contextLines: 1,
                expand: false,
              }
            )
          );
        }
      }
    ),
  ]);
};

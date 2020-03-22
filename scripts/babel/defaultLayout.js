const path = require("path");
const fs = require("fs");

const getFilename = state => state.file.opts.filename;

const setDefaultPluginState = state => {
  state.defaultLayoutPlugin = {
    defaultExportName: null
  };
};

const getPluginState = state => state.defaultLayoutPlugin;

const shouldProcessFile = state => {
  const filename = getFilename(state);
  if (
    filename.includes("node_modules") ||
    path.extname(filename) !== ".tsx" ||
    path.basename(filename).startsWith("_") ||
    !filename.includes("/pages/")
  ) {
    return false;
  }
  console.log("Applying to" + filename);
  return true;
};

const appendCodeToFile = (parse, program, state, code) => {
  program.pushContainer(
    "body",
    parse(code, {
      filename: getFilename(state),
      sourceType: "module",
      presets: ["next/babel"]
    }).program.body[0]
  );
};

const addLayoutToFile = (parse, program, state) => {
  const { defaultExportName } = getPluginState(state);
  const dirname = getFilename(state)
    .split("/pages/")[1]
    .split("/")[0];
  console.log("addLayout called", defaultExportName, dirname);
  if (fs.existsSync(path.join(process.cwd(), `layouts/${dirname}.tsx`))) {
    appendCodeToFile(
      parse,
      program,
      state,
      `${defaultExportName}.getLayout = require("${process.cwd()}/layouts/${dirname}").default`
    );
  }
};

module.exports = function({ types: t, parse }) {
  return {
    name: "next-default-layout",
    visitor: {
      ExportDefaultDeclaration(defaultExport, state) {
        if (!shouldProcessFile(state)) return;
        defaultExport.traverse({
          Identifier(p) {
            state.defaultLayoutPlugin.defaultExportName = p.node.name;
            p.stop();
          }
        });
      },
      Program: {
        enter(_, state) {
          setDefaultPluginState(state);
        },
        exit(program, state) {
          if (
            !shouldProcessFile(state) ||
            !getPluginState(state).defaultExportName
          )
            return;

          let getLayoutIsAlreadyDefined = false;

          // See if `getLayout` is assigned to the default export
          program.traverse({
            AssignmentExpression(path) {
              if (
                t.isMemberExpression(path.node.left) &&
                path.node.left.property.name === "getLayout"
              ) {
                getLayoutIsAlreadyDefined = true;
                path.stop();
              }
            }
          });

          if (!getLayoutIsAlreadyDefined) {
            addLayoutToFile(parse, program, state);
          }
        }
      }
    }
  };
};

/*

export default function(babel, ...args) {
  const { types: t, template } = babel;

  return {
    name: "ast-transform", // not required
    visitor: {
      ExportNamedDeclaration(path) {
        let d;
        if (path.node.declaration.declarations) {
          d = path.node.declaration.declarations[0].id.name;
        } else {
          d = path.node.declaration.id.name;
        }
        exports.push(d);
      },
      Program: {
        exit(path) {
          console.log(path.get("body"));
          path.pushContainer("body", layout());
        }
      }
    }
  };
}


*/

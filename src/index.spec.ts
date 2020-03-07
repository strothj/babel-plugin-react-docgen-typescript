import * as path from "path";
import * as babel from "babel-core";
import plugin, { PluginOptions } from "./index";

it("generates docgen for required props", async () => {
  const result = await transformFile("Component.tsx");

  expect(result.code).toMatchSnapshot();
});

it("omits prop from options", async () => {
  const result = await transformFile("Component.tsx", {
    skipPropsWithName: "onClick",
  });

  expect(result.code).toMatchSnapshot();
});

it("omits multiple props from options", async () => {
  const result = await transformFile("Component.tsx", {
    skipPropsWithName: ["label", "onClick"],
  });

  expect(result.code).toMatchSnapshot();
});

it("adds component to docgen collection", async () => {
  const result = await transformFile("Component.tsx", {
    docgenCollectionName: "STORYBOOK_REACT_CLASSES",
  });

  expect(result.code).toMatchSnapshot();
});

it("extracts literal values from enum, unions and custom types", async () => {
  const result = await transformFile("Component.tsx", {
    shouldExtractLiteralValuesFromEnum: true,
  });

  expect(result.code).toMatchSnapshot();
});

function transformFile(fixtureFilename: string, options: PluginOptions = {}) {
  const filePath = path.resolve(__dirname, "__fixtures__", fixtureFilename);

  return new Promise<babel.BabelFileResult>((resolve, reject) => {
    babel.transformFile(
      filePath,
      {
        plugins: [[plugin, options]],
      },
      (err, result) => {
        if (err != null) {
          reject(err);
          return;
        }

        resolve(result);
      },
    );
  });
}

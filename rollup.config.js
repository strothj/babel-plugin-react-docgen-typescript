import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";

export default {
  input: "src/index.ts",

  output: {
    file: "dist/index.js",
    format: "cjs",
  },

  // Suppress error the follow error and avoid bundling external dependencies:
  // Error: 'parse' is not exported by node_modules\react-docgen-typescript\lib\parser.js
  external: id => id !== "src/index.ts",

  // Plugin imports "types" from "babel-core" to create a type definition and
  // not to use directly. Suppress the warning here.
  onwarn: ({ code, source, message }) => {
    if (code === "UNUSED_EXTERNAL_IMPORT" && source === "babel-core") return;
    throw new Error(message);
  },

  // Enable aggressive tree shaking to remove unused import on babel-core.
  treeshake: {
    pureExternalModules: true,
  },

  plugins: [
    resolve({
      extensions: [".js", ".ts"],
    }),
    babel({
      exclude: "node_modules/**",
    }),
  ],
};

const env = process.env.BABEL_ENV || process.env.NODE_ENV;

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      { targets: { node: "6" }, modules: env === "test" ? "commonjs" : false },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
};

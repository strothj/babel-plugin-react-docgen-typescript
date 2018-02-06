module.exports = {
  testEnvironment: "node",
  testRegex: "/src/.*\\.spec\\.ts$",
  moduleFileExtensions: ["js", "json", "ts", "tsx"],
  transform: {
    "^.+\\.tsx?$": "<rootDir>/node_modules/babel-jest/build/index.js",
  },
};

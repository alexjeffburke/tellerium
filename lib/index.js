const fs = require("fs");
const path = require("path");

const side = require("./side");
const Tellerium = require("./Tellerium");

exports.Tellerium = Tellerium;

exports.fromFile = function fromFile(filePath, format, options) {
  options = options || {};

  if (!filePath) {
    throw new Error("Tellerium: missing test file");
  }

  let testFileContent;
  const testFile = path.resolve(filePath);
  if (path.extname(testFile) !== ".side") {
    throw new Error("Tellerium: specified test file is not from Selenium IDE");
  }
  try {
    const testFileStat = fs.statSync(testFile);
    if (!testFileStat.isFile()) {
      throw new Error();
    }
    testFileContent = JSON.parse(fs.readFileSync(testFile, "utf8"));
  } catch (e) {
    throw new Error("Tellerium: unable to load test file");
  }

  return exports.fromData(testFileContent, format, options);
};

exports.fromData = function fromData(content, format, options) {
  let testCases;
  switch (format) {
    case "side":
      testCases = side.validate(content);
      break;
    default:
      throw new Error(`Tellerium: unsupported file format`);
  }

  return new Tellerium({
    ...options,
    testCases
  });
};

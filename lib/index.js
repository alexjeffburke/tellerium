const fs = require("fs");
const path = require("path");

const Tellerium = require("./Tellerium");

exports.Tellerium = Tellerium;

exports.fromSide = function fromSide(options) {
  options = options || {};

  if (!options.testFile) {
    throw new Error("Tellerium: missing test file");
  }

  let testFileContent;
  const testFile = path.resolve(options.testFile);
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

  return new Tellerium({
    ...options,
    testCases: Array.isArray(testFileContent.tests) ? testFileContent.tests : []
  });
};

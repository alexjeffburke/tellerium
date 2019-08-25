const expect = require("unexpected");
const path = require("path");

const tellerium = require("../lib/index");

const TEST_DATA = path.join(__dirname, "..", "testdata");

describe("index", () => {
  describe("fromFile()", () => {
    it("should not allow a missing file", () => {
      expect(
        () => {
          tellerium.fromFile();
        },
        "to throw",
        "Tellerium: missing test file"
      );
    });

    it("should not allow an arbitrary file extension for side files", () => {
      expect(
        () => {
          tellerium.fromFile(path.join(TEST_DATA, "example.txt"), "side");
        },
        "to throw",
        "Tellerium: specified test file is not from Selenium IDE"
      );
    });

    it("should not allow a nonexistent path", () => {
      expect(
        () => {
          tellerium.fromFile(path.join(TEST_DATA, "nonexistent"), "unknown");
        },
        "to throw",
        "Tellerium: unable to load test file"
      );
    });

    it("should not allow a directory path", () => {
      expect(
        () => {
          tellerium.fromFile(path.join(TEST_DATA, "directory"), "unknown");
        },
        "to throw",
        "Tellerium: unable to load test file"
      );
    });

    it("should not allow a file containing invalid JSON", () => {
      expect(
        () => {
          tellerium.fromFile(path.join(TEST_DATA, "example.txt"), "unknown");
        },
        "to throw",
        "Tellerium: unable to load test file"
      );
    });
  });

  describe("when exeucuting an example side file", function() {
    this.timeout(10000);

    const sidedriver = tellerium.fromFile(
      path.join(TEST_DATA, "example.side"),
      "side"
    );

    before(() => {
      return sidedriver.createEnvironment();
    });

    after(() => {
      return sidedriver.destoryEnvironment();
    });

    it("should work", () => {
      return sidedriver.runTest("example");
    });
  });
});

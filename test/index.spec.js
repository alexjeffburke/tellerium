const expect = require("unexpected");
const path = require("path");

const Tellerium = require("../lib/index");

const TEST_DATA = path.join(__dirname, "..", "testdata");

describe("index", () => {
  describe("fromFile()", () => {
    it("should not allow a missing file", () => {
      expect(
        () => {
          Tellerium.fromFile();
        },
        "to throw",
        "Tellerium: missing test file"
      );
    });

    it("should not allow a nonexistent path", () => {
      expect(
        () => {
          Tellerium.fromFile(path.join(TEST_DATA, "nonexistent"), "unknown");
        },
        "to throw",
        "Tellerium: unable to load test file"
      );
    });

    it("should not allow a directory path", () => {
      expect(
        () => {
          Tellerium.fromFile(path.join(TEST_DATA, "directory"), "unknown");
        },
        "to throw",
        "Tellerium: unable to load test file"
      );
    });

    it("should not allow a file containing invalid JSON", () => {
      expect(
        () => {
          Tellerium.fromFile(path.join(TEST_DATA, "example.txt"), "unknown");
        },
        "to throw",
        "Tellerium: unable to load test file"
      );
    });
  });

  describe("when exeucuting an example side file", function() {
    this.timeout(10000);

    const sidedriver = Tellerium.fromFile(
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

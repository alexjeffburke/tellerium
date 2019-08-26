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

  describe("when instantiated", () => {
    it("should not allow a missing adapter", () => {
      expect(
        () => {
          // eslint-disable-next-line no-new
          new tellerium.Tellerium();
        },
        "to throw",
        "Tellerium: unsupported adapter"
      );
    });

    it("should not allow running a test before createEnvironment() is called", () => {
      const instance = new tellerium.Tellerium({
        adapter: "selenium",
        testCases: [{ name: "exampletest" }]
      });

      expect(
        () => instance.runTest("exampletest"),
        "to be rejected with",
        "Tellerium: attempt to run a test before creating environment"
      );
    });

    it("should not allow running a test when none exist", () => {
      const instance = new tellerium.Tellerium({ adapter: "selenium" });

      expect(
        () => instance.runTest("exampletest"),
        "to be rejected with",
        'Tellerium: unable to find test "exampletest"'
      );
    });

    it("should not allow running a test it does not exist", () => {
      const instance = new tellerium.Tellerium({
        adapter: "selenium",
        testCases: [{ name: "sometest" }]
      });

      expect(
        () => instance.runTest("othertest"),
        "to be rejected with",
        'Tellerium: unable to find test "othertest"'
      );
    });
  });

  describe("when exeucuting in pupeteer", function() {
    this.timeout(10000);

    const sidedriver = tellerium.fromFile(
      path.join(TEST_DATA, "example.side"),
      "side",
      { adapter: "puppeteer" }
    );

    before(() => {
      return sidedriver.createEnvironment();
    });

    after(() => {
      return sidedriver.destroyEnvironment();
    });

    it("should work", () => {
      return sidedriver.runTest("example");
    });
  });

  describe("when exeucuting in selenium", function() {
    this.timeout(10000);

    const sidedriver = tellerium.fromFile(
      path.join(TEST_DATA, "example.side"),
      "side",
      { adapter: "selenium" }
    );

    before(() => {
      return sidedriver.createEnvironment();
    });

    after(() => {
      return sidedriver.destroyEnvironment();
    });

    it("should work", () => {
      return sidedriver.runTest("example");
    });
  });
});

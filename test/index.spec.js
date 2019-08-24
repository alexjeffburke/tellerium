const path = require("path");

const Tellerium = require("../lib/index");

const TEST_DATA = path.join(__dirname, "..", "testdata");

describe("index", () => {
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

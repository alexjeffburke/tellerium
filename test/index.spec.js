const path = require("path");

const Tellerium = require("../lib/index");

const TEST_DATA = path.join(__dirname, "..", "testdata");

const sidedriver = Tellerium.fromFile(
  path.join(TEST_DATA, "example.side"),
  "side"
);

describe("index", function() {
  this.timeout(10000);

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

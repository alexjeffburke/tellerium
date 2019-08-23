const path = require("path");
const Tellerium = require("../lib/tellerium");

const TEST_DATA = path.join(__dirname, "..", "testdata");

const sidedriver = new Tellerium({
  testFile: path.join(TEST_DATA, "example.side")
});

describe("Tellerium", function() {
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

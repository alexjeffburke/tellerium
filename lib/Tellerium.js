const adapters = require("./adapters");
const executeTestInContext = require("./executeTestInContext");

class Tellerium {
  constructor(options) {
    options = options || {};

    const AdapterConstructor = adapters[options.adapter];
    if (!AdapterConstructor) {
      throw new Error(`Tellerium: unsupported adapter`);
    }

    const launchOptions = options.adapterOptions || {};
    this.adapter = new AdapterConstructor({ launchOptions });
    this.testCases = Array.isArray(options.testCases) ? options.testCases : [];
  }

  async createEnvironment() {
    return this.adapter.createEnvironment();
  }

  async destroyEnvironment() {
    return this.adapter.destroyEnvironment();
  }

  async runTest(testName) {
    const test = this.testCases.find(x => x.name === testName);
    if (!test) {
      throw new Error(`Tellerium: unable to find test "${testName}"`);
    }

    if (!this.adapter.isReady) {
      throw new Error(
        "Tellerium: attempt to run a test before creating environment"
      );
    }

    return executeTestInContext(test, this.adapter.testContext).then(
      () => this.testContext
    );
  }
}

module.exports = Tellerium;

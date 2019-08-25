const selenium = require("selenium-webdriver");
const Url = require("url");

const { By: by, until } = selenium;
const executeTestInContext = require("./executeTestInContext");

class Tellerium {
  constructor(options) {
    options = options || {};

    this.driver = null;
    this.browserName = options.browserName || "chrome";
    this.testCases = options.testCases;
    this._testContext = null;
  }

  get testContext() {
    if (!this.driver) {
      throw new Error(
        "Tellerium: attempt to run a test before creating environment"
      );
    }

    if (!this._testContext) {
      this._testContext = {
        driver: this.driver,
        executeScript: (script, scriptArgs) => {
          return this.driver.executeScript(script, ...scriptArgs);
        },
        findElementBySelector: selector => {
          return this.driver.findElement(by.css(selector));
        },
        inputClick: selector => {
          const element = this._testContext.findElementBySelector(selector);

          return element.click();
        },
        inputText: (selector, value) => {
          const element = this._testContext.findElementBySelector(selector);

          return element.sendKeys(value);
        },
        loadUrl: url => {
          try {
            // eslint-disable-next-line no-new
            new Url(url);
          } catch (e) {
            url = "http://" + url;
          }
          return this.driver.get(url);
        },
        waitForSelector: (selector, timeout) => {
          return this.driver.wait(
            until.elementLocated(by.css(selector)),
            timeout
          );
        },
        waitForUrl: (url, timeout) => {
          return this.driver.wait(until.urlContains(url), timeout);
        }
      };
    }

    return this._testContext;
  }

  async createEnvironment() {
    const { browserName } = this;
    const driver = new selenium.Builder()
      .withCapabilities({ browserName })
      .build();

    if (browserName !== "chrome") {
      driver
        .manage()
        .window()
        .maximize();
    }

    this.driver = driver;
  }

  async destoryEnvironment() {
    this.driver.quit();
  }

  async runTest(testName) {
    const test = this.testCases.find(x => x.name === testName);
    if (!test) {
      throw new Error(
        `Tellerium: runTest() - unable to find test: ${testName}`
      );
    }
    return executeTestInContext(test, this.testContext).then(
      () => this.testContext
    );
  }
}

module.exports = Tellerium;

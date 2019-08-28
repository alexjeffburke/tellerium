const selenium = require("selenium-webdriver");
const { By: by, until } = selenium;

const configureBrowserstack = require("./configureBrowserstack");

const defaultLaunchOptions = {
  browserStack: false
};

module.exports = class SeleniumAdapter {
  constructor(options) {
    this.driver = null;
    this.browserName = options.browserName || "chrome";
    this._testContext = null;
    this.launchOptions = {
      ...defaultLaunchOptions,
      ...options.launchOptions
    };

    if (this.launchOptions.browserStack) {
      this.launchOptions = {
        ...this.launchOptions,
        ...configureBrowserstack(this.browserName)
      };
    }
  }

  get isReady() {
    return this.driver !== null;
  }

  get testContext() {
    if (this._testContext === null) {
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
    const builder = new selenium.Builder();

    if (this.launchOptions.browserStack) {
      builder.usingServer(this.launchOptions.browserStackServer);
    }

    return builder
      .withCapabilities({
        ...this.launchOptions.capabilities,
        browserName: this.browserName
      })
      .build()
      .then(driver => {
        this.driver = driver;

        if (browserName !== "chrome") {
          return driver
            .manage()
            .window()
            .maximize();
        }
      });
  }

  async destroyEnvironment() {
    this.driver.quit();
    this.driver = null;
  }
};

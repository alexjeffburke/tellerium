const puppeteer = require("puppeteer");

const defaultLaunchOptions = {
  headless: true
};

module.exports = class PuppeteerAdapter {
  constructor(options) {
    options = options || {};

    this.browser = null;
    this.page = null;
    this._testContext = null;
    this.launchOptions = {
      ...defaultLaunchOptions,
      ...options.launchOptions
    };
  }

  get isReady() {
    return this.driver !== null;
  }

  get testContext() {
    if (this._testContext === null) {
      this._testContext = {
        browser: this.browser,
        page: this.page,
        executeScript: (script, scriptArgs) => {
          return this.page.evaluate(script, ...scriptArgs);
        },
        findElementBySelector: selector => {
          return this.page.$(selector);
        },
        inputClick: selector => {
          return this.page.$(selector).then(elementHandle => {
            return elementHandle.click();
          });
        },
        inputText: (selector, value) => {
          return this.page.$(selector).then(elementHandle => {
            return elementHandle.type(value);
          });
        },
        loadUrl: url => {
          return this.page.goto(url);
        },
        waitForSelector: (selector, timeout) => {
          return this.page.waitForSelector(selector, { timeout });
        },
        waitForUrl: (url, timeout) => {
          return this.page.waitFor(
            () => {
              return this.page.url().includes(url);
            },
            { timeout }
          );
        }
      };
    }

    return this._testContext;
  }

  async createEnvironment() {
    this.browser = await puppeteer.launch(this.launchOptions);
    this.page = await this.browser.newPage();
  }

  async destroyEnvironment() {
    await this.browser.close();
    this.browser = null;
    this.page = null;
  }
};

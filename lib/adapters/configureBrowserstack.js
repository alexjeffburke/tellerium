const defaultBrowserstackServer = "https://hub-cloud.browserstack.com/wd/hub";
const defaultCapabilities = {
  browser: null,
  platform: "ANY",
  "browserstack.user": null,
  "browserstack.key": null,
  "browserstack.debug": "false",
  "browserstack.video": "false",
  "browserstack.selenium_version": "3.6.0"
};

module.exports = function(browser) {
  const capabilities = { ...defaultCapabilities, browser };

  if (!process.env.BROWSERSTACK_USERNAME) {
    throw new Error("missing environment variable BROWSERSTACK_USERNAME");
  }

  if (!process.env.BROWSERSTACK_KEY) {
    throw new Error("missing environment variable BROWSERSTACK_KEY");
  }

  capabilities["browserstack.user"] = process.env.BROWSERSTACK_USERNAME;
  capabilities["browserstack.key"] = process.env.BROWSERSTACK_KEY;

  const browserStackServer =
    process.env.BROWSERSTACK_SERVER || defaultBrowserstackServer;

  return {
    capabilities,
    browserStackServer
  };
};

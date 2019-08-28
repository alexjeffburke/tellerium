# Tellerium

This module provides facilities for execution of captured browser tests.

[![NPM version](https://img.shields.io/npm/v/tellerium.svg)](https://www.npmjs.com/package/tellerium)

The only file format currently supported is output from Selenium IDE.
Files in this format can be loaded directly, validated and executed.

Tests can be exdecuted by the following engines:

- Chromium (via Puppeteer)
- Selenium Webdriver
- Browsertack (using Selenium)

> tests are executed headless in puppeteer by default

## Use

### CLI

A simple command line binary is provided that allows going straight from
loading a file to having the tests executed and their success or failure
displayed in the style of a stanard JavaScript terminal test runner.

```
tellerium execute --type side /path/to/file.side
```

### npx

The module can be used without installation as a tool by using it with npx:

```
npx tellerium execute --type side /path/to/file.side
```

### Library

Tellerium can also be integrated as a library. The simplest way of
doing this is to use a helper function to directly load a test file.

Integrating this into an existing test suite is as simple as:

```js
const sidedriver = tellerium.fromFile(
  path.join(TEST_DATA, "example.side"),
  "side"
);

describe("when running some browser tests", function() {
  this.before(() => {
    return sidedriver.createEnvironment();
  });

  after(() => {
    return sidedriver.destroyEnvironment();
  });

  it("should work", () => {
    return sidedriver.runTest("example");
  });
});
```

The exported `fromFile()` function takes care of loading tests
from the supplied file and returns an instance of the main class.

This class can also be constructed via the named export `Tellerium`
which allows passing test cases directly:

```js
const instance = new tellerium.Tellerium({
  testCases: [
    {
      name: "sometest",
      commands: [
        /*...*/
      ]
    }
  ]
});
```

## Options

Test execution can be customised by provided additonal options. While
the module defaults to headless puppeteer, seeing the output visually
can be requested by supplying the `--ramble` option. Execution of the
tests via a selenium webdriver is also supported via `--selenium`.

### BrowerStack

The module also has preliminary support for testing in BrowserStack.
This can be configuried by using the `--browserstack` option and then
invoking the binary with the following two environment variables:

- BROWSERSTACK_USERNAME - the user to connect with
- BROWSERSTACK_KEY - the API key for this user

An example invocation of this is as follows:

```
BROWSERSTACK_USERNAME=user BROWSERSTACK_KEY=xxx ./bin/tellerium --browserstack --type side ./example.side
```

_Currently the module will select Chrome running on an arbitrary platform_
_but upcoming changes are likely to expand the configuration syntax._

## Support

### Selenium IDE

Four basic commands are currently impelemented:

- open
- click
- type
- waitForElementVisible

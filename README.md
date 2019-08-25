# Tellerium

This module provides facilities for execution of captured browser tests.

The only file format currently supported is output from Selenium IDE.
Files in this format can be loaded directly, validated and executed.

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

## Execution

Tests are executed by issuing commands via a selenium webdriver.

## Support

### Selenium IDE

Four basic commands are currently impelemented:

- open
- click
- type
- waitForElementVisible
const Url = require("url");

const sideCommands = {
  open: "loadUrl",
  waitForElementVisible: "waitForSelector",
  click: "inputClick",
  type: "inputText"
};

exports.validate = function(input) {
  if (!(input && Array.isArray(input.tests))) {
    throw new Error("missing test cases");
  }

  const testCases = [];
  const allUnsupportedCommands = [];

  for (const testCase of input.tests) {
    const inputCommands = testCase.commands;
    if (!Array.isArray(inputCommands)) {
      throw new Error(`missing commands in test: "${test.name}"`);
    }

    const commands = [];
    const unsupportedCommands = [];
    for (const cmd of inputCommands) {
      const mappedCommand = sideCommands[cmd.command];
      if (mappedCommand) {
        if (mappedCommand === "loadUrl") {
          const url = cmd.value;
          try {
            // eslint-disable-next-line no-new
            new Url(url);
          } catch (e) {
            cmd.value = "http://" + url;
          }
        }

        commands.push({
          ...cmd,
          command: mappedCommand
        });
      } else {
        unsupportedCommands.push(cmd.command);
      }
    }

    if (unsupportedCommands.length > 0) {
      allUnsupportedCommands.push(...unsupportedCommands);
    } else {
      testCases.push({
        ...testCase,
        commands
      });
    }
  }

  if (allUnsupportedCommands.length > 0) {
    const messageCommands = Array.from(
      new Set(allUnsupportedCommands).values()
    );
    throw new Error(
      `unsupported commands in tests: ${JSON.stringify(messageCommands)}`
    );
  }

  return testCases;
};

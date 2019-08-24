const sideCommands = {
  open: true,
  waitForElementVisible: true,
  click: true,
  type: true
};

exports.validate = function(input) {
  if (!(input && Array.isArray(input.tests))) {
    throw new Error("missing test cases");
  }

  const testCases = [];
  const allUnsupportedCommands = [];

  for (const testCase of input.tests) {
    const commands = testCase.commands;
    if (!Array.isArray(commands)) {
      throw new Error(`missing commands in test: "${test.name}"`);
    }

    const unsupportedCommands = commands.filter(
      cmd => !sideCommands[cmd.command]
    );

    if (unsupportedCommands.length > 0) {
      allUnsupportedCommands.push(...unsupportedCommands);
    } else {
      testCases.push(testCase);
    }
  }

  if (allUnsupportedCommands.length > 0) {
    const messageCommands = new Set(allUnsupportedCommands).values();
    throw new Error(
      `unsupported commands in tests: ${JSON.stringify(messageCommands)}`
    );
  }

  return testCases;
};

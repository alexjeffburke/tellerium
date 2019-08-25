module.exports = function executeTestInDriver(test, context) {
  let currentPromise = Promise.resolve();

  test.commands.forEach(cmd => {
    const { command, target, value } = cmd;

    let selector;
    if (target) {
      const matchedTarget = target.match(/css=(.*)/);
      selector = matchedTarget[1];
    }

    switch (command) {
      case "open":
        currentPromise = currentPromise.then(() => {
          return context.loadUrl(value);
        });
        break;
      case "waitForElementVisible":
        currentPromise = currentPromise.then(() => {
          return context.waitForSelector(selector, Number(value));
        });
        break;
      case "click":
        currentPromise = currentPromise.then(() => {
          return context.inputClick(selector);
        });
        break;
      case "type":
        currentPromise = currentPromise.then(() => {
          return context.inputText(selector, value);
        });
        break;
    }
  });

  return currentPromise;
};

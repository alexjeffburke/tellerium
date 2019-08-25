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
      case "loadUrl":
        currentPromise = currentPromise.then(() => {
          return context.loadUrl(value);
        });
        break;
      case "waitForSelector":
        currentPromise = currentPromise.then(() => {
          return context.waitForSelector(selector, Number(value));
        });
        break;
      case "inputClick":
        currentPromise = currentPromise.then(() => {
          return context.inputClick(selector);
        });
        break;
      case "inputText":
        currentPromise = currentPromise.then(() => {
          return context.inputText(selector, value);
        });
        break;
    }
  });

  return currentPromise;
};

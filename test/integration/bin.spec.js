const expect = require("unexpected");
const path = require("path");
const spawn = require("child_process").spawn;

const BIN_FILE = path.join(__dirname, "..", "..", "bin", "tellerium");
const TEST_DATA = path.join(__dirname, "..", "..", "testdata");

function spawnCli(options) {
  options = options || {};

  const { cwd, bin, args } = options;

  const spawnedCli = spawn(bin, args, {
    cwd,
    stdio: [options.stdin ? "pipe" : "ignore"]
  });

  const p = new Promise((resolve, reject) => {
    let sawExit = false;
    let stdout = "";
    let stderr = "";

    spawnedCli.stdout.on("data", chunk => {
      stdout += chunk.toString("utf8");
    });

    spawnedCli.stderr.on("data", chunk => {
      stderr += chunk.toString("utf8");
    });

    const makeError = code => {
      const error = new Error("spawnCli error");
      error.code = code;
      error.stdout = stdout;
      error.stderr = stderr;
      return error;
    };

    spawnedCli.on("error", () => {
      if (sawExit) {
        return;
      }

      sawExit = true;

      reject(makeError(null));
    });

    spawnedCli.on("exit", code => {
      if (sawExit) {
        return;
      }

      sawExit = true;

      if (code) {
        reject(makeError(code));
      } else {
        resolve({ stdout, stderr });
      }
    });
  });

  p._spawn = spawnedCli;

  return p;
}

describe("bin - integration", () => {
  it("should use headless puppeteer", () => {
    const testFile = path.join(TEST_DATA, "example.side");

    return spawnCli({
      cwd: process.cwd(),
      bin: BIN_FILE,
      args: [testFile, "--type", "side"]
    });
  });

  it("should use non-headless puppeteer", () => {
    const testFile = path.join(TEST_DATA, "example.side");

    return spawnCli({
      cwd: process.cwd(),
      bin: BIN_FILE,
      args: [testFile, "--type", "side", "--ramble"]
    });
  });

  it("should use selenium webdriver", function() {
    this.timeout(4000);

    const testFile = path.join(TEST_DATA, "example.side");

    return spawnCli({
      cwd: process.cwd(),
      bin: BIN_FILE,
      args: [testFile, "--type", "side", "--selenium"]
    });
  });

  it("should error with exit code on failure", () => {
    const testFile = path.join(TEST_DATA, "failing.side");

    return expect(
      () =>
        spawnCli({
          cwd: process.cwd(),
          bin: BIN_FILE,
          args: [testFile, "--type", "side"]
        }),
      "to be rejected with",
      { code: 1 }
    );
  });

  it("should error with a nice message on failure", () => {
    const testFile = path.join(TEST_DATA, "failing.side");

    return expect(
      () =>
        spawnCli({
          cwd: process.cwd(),
          bin: BIN_FILE,
          args: [testFile, "--type", "side"]
        }),
      "to be rejected with",
      { stderr: expect.it("to contain", "Some failing tests were recorded: 1") }
    );
  });
});

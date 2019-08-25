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
  it("should have created the module folder", () => {
    const testFile = path.join(TEST_DATA, "example.side");

    return spawnCli({
      cwd: process.cwd(),
      bin: BIN_FILE,
      args: [testFile, "side"]
    });
  });
});

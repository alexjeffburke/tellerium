const expect = require("unexpected");

const side = require("../lib/side");

describe("side", function() {
  it("should report unsupported commands", () => {
    expect(
      () => {
        return side.validate({
          tests: [
            {
              name: "test1",
              commands: [{ command: "unsupported" }]
            }
          ]
        });
      },
      "to throw",
      'unsupported commands in tests: ["unsupported"]'
    );
  });
});

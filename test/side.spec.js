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

  it("should return validated test cases (using example file)", () => {
    expect(
      side.validate({
        tests: [
          {
            commands: [
              {
                command: "open",
                comment: "",
                id: "01b0b9dc-337a-40bb-9226-244eadc34280",
                target: "",
                targets: [],
                value: "localhost:8080/example"
              },
              {
                command: "waitForElementVisible",
                comment: "",
                id: "9fe2fe85-a0fb-4843-a9db-577c0d70f37e",
                target: "css=button",
                targets: [
                  ["css=button", "css"],
                  ["xpath=//button", "xpath:position"]
                ],
                value: "12000"
              },
              {
                command: "click",
                comment: "",
                id: "09f93a1e-0301-4d15-9d53-d760a8e1884a",
                target: "css=button",
                targets: [
                  ["css=button", "css"],
                  ["xpath=//button", "xpath:position"]
                ],
                value: ""
              },
              {
                command: "type",
                comment: "",
                id: "09f93a1e-0301-4d15-9d53-d760a8e1884b",
                target: "css=textarea",
                targets: [
                  ["css=textarea", "css"],
                  ["xpath=//textarea", "xpath:position"]
                ],
                value: "foobar"
              }
            ],
            id: "f688e544-de09-419f-9dbc-6a2ed0623ddf",
            name: "example"
          }
        ]
      }),
      "to satisfy",
      expect.it("to be an array")
    );
  });
});

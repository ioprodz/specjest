import { exec, spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const CLI_PATH = path.resolve(__dirname, "../cli.app.ts");
const FIXTURES_DIR = path.resolve(__dirname, "./fixtures");

describe("E2E: specjest feat command", () => {
  it("should fail gracefully when stdin is empty or no input is provided", (done) => {
    // Simulate user running CLI without proper pipe (empty stdin)
    const cli = spawn("npx", ["ts-node", CLI_PATH, "feat"], {
      cwd: process.cwd(),
      shell: true,
    });

    let cliStdout = "";
    let cliStderr = "";

    cli.stdout.on("data", (data) => {
      cliStdout += data.toString();
    });

    cli.stderr.on("data", (data) => {
      cliStderr += data.toString();
    });

    // Close stdin immediately without writing anything
    cli.stdin.end();

    cli.on("close", (code) => {
      // Should fail but with a helpful error message
      expect(code).not.toBe(0);
      expect(cliStderr).toContain("No input received from stdin");
      done();
    });
  }, 30000);

  it("should handle stdin that closes before readline is ready (race condition)", (done) => {
    // This tests a potential race condition where stdin closes very quickly
    const testFilePath = path.join(FIXTURES_DIR, "race-test.spec.ts");
    const testContent = `
describe("Feature: Race Test", () => {
  describe("Scenario: Quick test", () => {
    describe("Given setup", () => {
      describe("When action", () => {
        it("Then result", () => expect(true).toBe(true));
      });
    });
  });
});
`;
    fs.writeFileSync(testFilePath, testContent);

    // Run Jest and pipe to CLI, measuring timing
    exec(
      `npx jest "${testFilePath}" --json --testPathIgnorePatterns=[]`,
      { cwd: process.cwd() },
      (jestError, jestStdout, jestStderr) => {
        // Very quickly spawn CLI and pipe
        const cli = spawn("npx", ["ts-node", CLI_PATH, "feat"], {
          cwd: process.cwd(),
          shell: true,
        });

        let cliStdout = "";
        let cliStderr = "";

        cli.stdout.on("data", (data) => {
          cliStdout += data.toString();
        });

        cli.stderr.on("data", (data) => {
          cliStderr += data.toString();
        });

        // Immediately write and close stdin
        cli.stdin.write(jestStdout);
        cli.stdin.end();

        cli.on("close", (code) => {
          fs.unlinkSync(testFilePath);
          const featureFile = path.join(FIXTURES_DIR, "race-test.feature");
          if (fs.existsSync(featureFile)) {
            fs.unlinkSync(featureFile);
          }

          expect(code).toBe(0);
          expect(cliStdout).toContain("Successfully written feature files");
          done();
        });
      }
    );
  }, 30000);

  beforeAll(() => {
    // Ensure fixtures directory exists
    if (!fs.existsSync(FIXTURES_DIR)) {
      fs.mkdirSync(FIXTURES_DIR, { recursive: true });
    }
  });

  afterAll(() => {
    // Cleanup generated files
    const featureFile = path.join(FIXTURES_DIR, "sample-bdd.feature");
    if (fs.existsSync(featureFile)) {
      fs.unlinkSync(featureFile);
    }
  });

  it("should parse piped Jest JSON output and generate feature files", (done) => {
    // Create a sample BDD test file
    const testFilePath = path.join(FIXTURES_DIR, "sample-bdd.spec.ts");
    const testContent = `
describe("Feature: Sample Feature", () => {
  describe("Scenario: Happy path", () => {
    describe("Given some precondition", () => {
      describe("When an action is taken", () => {
        it("Then expected outcome occurs", () => {
          expect(true).toBe(true);
        });
      });
    });
  });
});
`;
    fs.writeFileSync(testFilePath, testContent);

    // Run Jest with --json and pipe to our CLI
    const jestCommand = `npx jest "${testFilePath}" --json --testPathIgnorePatterns=[]`;

    exec(jestCommand, { cwd: process.cwd() }, (jestError, jestStdout, jestStderr) => {
      // Now pipe Jest output to the CLI
      const cli = spawn("npx", ["ts-node", CLI_PATH, "feat"], {
        cwd: process.cwd(),
        shell: true,
      });

      let cliStdout = "";
      let cliStderr = "";

      cli.stdout.on("data", (data) => {
        cliStdout += data.toString();
      });

      cli.stderr.on("data", (data) => {
        cliStderr += data.toString();
      });

      // Write Jest output to CLI stdin
      cli.stdin.write(jestStdout);
      cli.stdin.end();

      cli.on("close", (code) => {
        // Cleanup test file
        fs.unlinkSync(testFilePath);

        if (code !== 0) {
          done(new Error(`CLI failed with code ${code}: ${cliStderr}`));
          return;
        }

        expect(cliStdout).toContain("Successfully written feature files");
        done();
      });
    });
  }, 30000);

  it("should handle real pipe scenario like user would run", (done) => {
    // Create a sample BDD test file
    const testFilePath = path.join(FIXTURES_DIR, "sample-bdd-pipe.spec.ts");
    const testContent = `
describe("Feature: Pipe Test Feature", () => {
  describe("Scenario: Testing pipe", () => {
    describe("Given a test setup", () => {
      describe("When jest runs with json flag", () => {
        it("Then output is piped correctly", () => {
          expect(1 + 1).toBe(2);
        });
      });
    });
  });
});
`;
    fs.writeFileSync(testFilePath, testContent);

    // Run the full pipe command as user would
    const fullCommand = `npx jest "${testFilePath}" --json --testPathIgnorePatterns=[] | npx ts-node ${CLI_PATH} feat`;

    exec(fullCommand, { cwd: process.cwd(), shell: "/bin/bash" }, (error, stdout, stderr) => {
      // Cleanup test file
      fs.unlinkSync(testFilePath);

      // Check if feature file was created
      const featureFile = path.join(FIXTURES_DIR, "sample-bdd-pipe.feature");
      if (fs.existsSync(featureFile)) {
        fs.unlinkSync(featureFile);
      }

      if (error) {
        done(new Error(`Pipe command failed: ${error.message}\nstderr: ${stderr}`));
        return;
      }

      expect(stdout).toContain("Successfully written feature files");
      done();
    });
  }, 30000);
});

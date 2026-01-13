import { BehaviouralTestSuite } from "../behavioural-tests/behavioural-test-suite.entity";
import path from "path";

type FeatureFileDefinition = {
  filePath: string;
  content: string;
};

type FeatureFileFromTestResult = {
  successful: FeatureFileDefinition[];
  failed: FeatureFileDefinition[];
};

export class FeatureFileFromTestUsecase {
  execute(input: string): FeatureFileFromTestResult {
    const result: FeatureFileFromTestResult = {
      successful: [],
      failed: [],
    };
    this.parseRawToJson(input).forEach((testSuite: Record<string, any>) => {
      try {
        const bddTest = BehaviouralTestSuite.createWithAssertions({
          assertions: this.getSanitizedAssertions(testSuite),
          testPath: testSuite.name,
        });
        result.successful.push({
          filePath: this.testPathToFeaturePath(bddTest.testPath),
          content: bddTest.toGherkin(),
        });
      } catch (e) {
        result.failed.push({
          filePath: testSuite.name,
          content: (e as Error).message,
        });
      }
    });

    return result;
  }

  private testPathToFeaturePath(testPath: string) {
    const { base, dir } = path.parse(testPath);
    const [fileName] = base.split(".");
    return `${dir}/${fileName}.feature`;
  }

  private parseRawToJson(rawTestOutput: string): Record<string, any> {
    const trimmedOutput = rawTestOutput.trim();

    if (!trimmedOutput) {
      throw new Error(
        `No input received from stdin.\n\n` +
        `Make sure you're piping Jest output correctly:\n` +
        `  <your-jest-command> --json | npx specjest feat\n\n` +
        `Troubleshooting:\n` +
        `  1. Ensure Jest runs with --json flag\n` +
        `  2. Check that your Jest command outputs to stdout (not just stderr)\n` +
        `  3. Try: npx jest --json > output.json && cat output.json | npx specjest feat`
      );
    }

    const lines = trimmedOutput.split("\n");
    // Search from the end since JSON is typically the last line
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const parsed = JSON.parse(lines[i]);
        if (parsed.testResults) {
          return parsed.testResults;
        }
      } catch (e) {
        // Not valid JSON, try previous line
      }
    }

    // No valid JSON found
    const preview = trimmedOutput.length > 200
      ? trimmedOutput.slice(0, 200) + "..."
      : trimmedOutput;
    throw new Error(
      `Could not find Jest JSON output in stdin.\n\n` +
      `Received ${trimmedOutput.length} bytes, but no valid Jest JSON was found.\n` +
      `Input preview:\n${preview}\n\n` +
      `Make sure Jest is running with --json flag and the output contains testResults.`
    );
  }

  private getSanitizedAssertions(testSuite: Record<string, any>): string[][] {
    return testSuite.assertionResults.map((a: Record<string, any>) =>
      [...a.ancestorTitles.map((t: string) => t + "\n\n"), a.title]
        .join("")
        .split("\n")
        .map((t: string) =>
          t
            .replace(/\u001b\[[0-9;]*m/g, "")
            .trim()
            .replace("\n", "")
        )
        .filter((t) => t !== "")
    );
  }
}

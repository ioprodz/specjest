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
    const lines = rawTestOutput.split("\n");
    let i = lines.length - 1;
    while (i >= 0) {
      try {
        const result = JSON.parse(lines[i - 1]).testResults;
        return result;
      } catch (e) {
        // just skip this line
      }
      i--;
    }
    // we parsed / returned no lines
    throw new Error(`Error: Jest output could not be parsed:
    ${rawTestOutput}
    `);
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

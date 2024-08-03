import path from "path";
import { BehaviouralTestSuite } from "../behavioural-tests/behavioural-test-suite.entity";
import {
  BehaviouralTestDescription,
  BehaviouralTestDescriptionType,
} from "../behavioural-tests/behavioural-test-description.value";

type TestFileFromFeatureInput = {
  filePath: string;
  gherkin: string;
};

type TestFileDefinition = {
  filePath: string;
  content: string;
};

export class TestFileFromFeatureUsecase {
  execute(input: TestFileFromFeatureInput): TestFileDefinition {
    const assertions: string[][] = this.getSanitizedAssertionList(input);

    const bddTest = BehaviouralTestSuite.createWithAssertions({
      testPath: this.featurePathToTestPath(input.filePath),
      assertions,
    });

    return {
      filePath: bddTest.testPath,
      content: bddTest.toJestTestSuite(),
    };
  }

  private getSanitizedAssertionList(input: TestFileFromFeatureInput) {
    const rawAssertionList = input.gherkin
      .split("\n")
      .filter((l) => l !== "")
      .map((l) => l.trim());

    const [featureDescription] = rawAssertionList;
    const assertions: string[][] = [];

    rawAssertionList.slice(1).forEach((assertionDescription) => {
      const description =
        BehaviouralTestDescription.create(assertionDescription);
      if (description.type === BehaviouralTestDescriptionType.Scenario) {
        assertions.push([featureDescription, assertionDescription]);
      } else {
        assertions[assertions.length - 1].push(assertionDescription);
      }
    });
    return assertions;
  }

  private featurePathToTestPath(featurePath: string) {
    const { base, dir } = path.parse(featurePath);
    const [fileName] = base.split(".");
    return `${dir}/${fileName}.spec.ts`;
  }
}

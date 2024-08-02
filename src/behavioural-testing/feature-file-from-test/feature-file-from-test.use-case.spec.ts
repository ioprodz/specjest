import { FeatureFileFromTestUsecase } from './feature-file-from-test.use-case';

describe('Feature: BDD ⭐ FeatureFileFromTestUsecase', () => {
  const usecase = new FeatureFileFromTestUsecase();
  describe('Scenario: 🎉 Happy path 😀', () => {
    describe('Given jest payload is correct', () => {
      describe('When its passed to the parser', () => {
        test('Then it converts test file path the .feature path', () => {
          const { successful } = usecase.execute(correctJestOutputFixture);
          expect(successful[0].filePath).toBe(
            '/.tooling/code-generators/bdd/feature-file-from-test.feature',
          );
        });

        test('And computes the gherkin file content', () => {
          const { successful } = usecase.execute(correctJestOutputFixture);
          expect(successful[0].content).toBe(expectedGerkin);
        });

        test('And gives 0 failed files', () => {
          const { failed } = usecase.execute(correctJestOutputFixture);
          expect(failed.length).toBe(0);
        });
      });
    });
  });

  describe('Scenario: 🎥 trying to parse bad jest output', () => {
    describe('Given 🙅 jest payload is corrupted', () => {
      describe('When its passed to the parser', () => {
        test('Then opration is rejected', () => {
          expect(() => usecase.execute('corrupted')).toThrow();
        });
      });
    });
  });

  describe('Scenario: 🎥 bad gherkin syntax - example: "Feator:" instead of "Feature:"', () => {
    describe(`
      Given jest payload is correct
      And 🙅 keyword 'Feature:' is mispelled 'Feator:'
    `, () => {
      describe('When its passed to the parser', () => {
        test('Then its present in errored files', () => {
          const { failed } = usecase.execute(badGherkinSyntaxJestOutput1);
          expect(failed[0].filePath).toBe(
            '/.tooling/code-generators/bdd/feature-file-from-test.use-case.spec.ts',
          );
        });
        test('And it reports Bdd Description parse error', () => {
          const { failed } = usecase.execute(badGherkinSyntaxJestOutput1);
          expect(failed[0].content).toBe(
            'cannot determine type of Bdd Description: Feator: FeatureFileFromTestUsecase',
          );
        });
      });
    });
  });

  describe('Scenario: 🎥 bad gherkin syntax - unidentified test phase (Given)', () => {
    describe(`
      Given jest payload is correct
      And 🙅 a scenario is missing the keyword 'Given'
    `, () => {
      describe('When its passed to the parser', () => {
        test('Then its present in errored files', () => {
          const { failed } = usecase.execute(badGherkinSyntaxJestOutput2);
          expect(failed[0].filePath).toBe(
            '/.tooling/code-generators/bdd/feature-file-from-test.use-case.spec.ts',
          );
        });
        test('And it reports phase parse error for Given', () => {
          const { failed } = usecase.execute(badGherkinSyntaxJestOutput2);
          expect(failed[0].content).toBe(
            'Cannot identify bdd test phase: Given',
          );
        });
      });
    });
  });

  describe('Scenario: 🎥 bad gherkin syntax - unidentified test phase (When)', () => {
    describe(`
      Given jest payload is correct
      And 🙅 a scenario is missing the keyword 'When'
    `, () => {
      describe('When its passed to the parser', () => {
        test('Then its present in errored files', () => {
          const { failed } = usecase.execute(badGherkinSyntaxJestOutput3);
          expect(failed[0].filePath).toBe(
            '/.tooling/code-generators/bdd/feature-file-from-test.use-case.spec.ts',
          );
        });
        test('And it reports phase parse error for When', () => {
          const { failed } = usecase.execute(badGherkinSyntaxJestOutput3);
          expect(failed[0].content).toBe(
            'Cannot identify bdd test phase: When',
          );
        });
      });
    });
  });
});

// 'Feator:' instead of 'Feature:'
const badGherkinSyntaxJestOutput1 = `yarn run v1.22.19
$ jest --config .tooling/jest-configuration/tooling.config.js --json
{"numFailedTestSuites":0,"numFailedTests":0,"numPassedTestSuites":1,"numPassedTests":4,"numPendingTestSuites":0,"numPendingTests":0,"numRuntimeErrorTestSuites":0,"numTodoTests":0,"numTotalTestSuites":1,"numTotalTests":4,"openHandles":[],"snapshot":{"added":0,"didUpdate":false,"failure":false,"filesAdded":0,"filesRemoved":0,"filesRemovedList":[],"filesUnmatched":0,"filesUpdated":0,"matched":0,"total":0,"unchecked":0,"uncheckedKeysByFile":[],"unmatched":0,"updated":0},"startTime":1687119130402,"success":true,"testResults":[{"assertionResults":[{"ancestorTitles":["Feator: FeatureFileFromTestUsecase","Scenario: Happy Path","Given jest payload is correct","When its passed to the parser"],"duration":4,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: Happy Path Given jest payload is correct When its passed to the parser Then it converts test file path the .feature path","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"Then it converts test file path the .feature path"},{"ancestorTitles":["Feature: FeatureFileFromTestUsecase","Scenario: Happy Path","Given jest payload is correct","When its passed to the parser"],"duration":0,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: Happy Path Given jest payload is correct When its passed to the parser And computes the gherkin file content","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"And computes the gherkin file content"},{"ancestorTitles":["Feature: FeatureFileFromTestUsecase","Scenario: trying to parse bad jest output","Given jest payload is corrupted","When its passed to the parser"],"duration":10,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: trying to parse bad jest output Given jest payload is corrupted When its passed to the parser Then opration is rejected","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"Then opration is rejected"},{"ancestorTitles":["Feature: FeatureFileFromTestUsecase","Scenario: trying to create a bdd test from a test that does not respect gherkin","\\n    Given jest payload is correct\\n    And gherkin syntax is not repected\\n    ","When its passed to the parser"],"duration":1,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: trying to create a bdd test from a test that does not respect gherkin \\n    Given jest payload is correct\\n    And gherkin syntax is not repected\\n     When its passed to the parser Then operation is rejected","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"Then operation is rejected"}],"endTime":1687119139184,"message":"","name":"/.tooling/code-generators/bdd/feature-file-from-test.use-case.spec.ts","startTime":1687119130477,"status":"passed","summary":""}],"wasInterrupted":false}
Done in 10.24s.
`;

// directly starting with 'And' instead of 'When'
const badGherkinSyntaxJestOutput2 = `yarn run v1.22.19
$ jest --config .tooling/jest-configuration/tooling.config.js --json
{"numFailedTestSuites":0,"numFailedTests":0,"numPassedTestSuites":1,"numPassedTests":4,"numPendingTestSuites":0,"numPendingTests":0,"numRuntimeErrorTestSuites":0,"numTodoTests":0,"numTotalTestSuites":1,"numTotalTests":4,"openHandles":[],"snapshot":{"added":0,"didUpdate":false,"failure":false,"filesAdded":0,"filesRemoved":0,"filesRemovedList":[],"filesUnmatched":0,"filesUpdated":0,"matched":0,"total":0,"unchecked":0,"uncheckedKeysByFile":[],"unmatched":0,"updated":0},"startTime":1687119130402,"success":true,"testResults":[{"assertionResults":[{"ancestorTitles":["Feature: FeatureFileFromTestUsecase","Scenario: Happy Path","Given jest payload is correct","When its passed to the parser"],"duration":4,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: Happy Path Given jest payload is correct When its passed to the parser Then it converts test file path the .feature path","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"Then it converts test file path the .feature path"},{"ancestorTitles":["Feature: FeatureFileFromTestUsecase","Scenario: Happy Path","And jest payload is correct","When its passed to the parser"],"duration":0,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: Happy Path Given jest payload is correct When its passed to the parser And computes the gherkin file content","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"And computes the gherkin file content"},{"ancestorTitles":["Feature: FeatureFileFromTestUsecase","Scenario: trying to parse bad jest output","Given jest payload is corrupted","When its passed to the parser"],"duration":10,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: trying to parse bad jest output Given jest payload is corrupted When its passed to the parser Then opration is rejected","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"Then opration is rejected"},{"ancestorTitles":["Feature: FeatureFileFromTestUsecase","Scenario: trying to create a bdd test from a test that does not respect gherkin","\\n    Given jest payload is correct\\n    And gherkin syntax is not repected\\n    ","When its passed to the parser"],"duration":1,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: trying to create a bdd test from a test that does not respect gherkin \\n    Given jest payload is correct\\n    And gherkin syntax is not repected\\n     When its passed to the parser Then operation is rejected","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"Then operation is rejected"}],"endTime":1687119139184,"message":"","name":"/.tooling/code-generators/bdd/feature-file-from-test.use-case.spec.ts","startTime":1687119130477,"status":"passed","summary":""}],"wasInterrupted":false}
Done in 10.24s.
`;

// directly starting with 'And' instead of 'When'
const badGherkinSyntaxJestOutput3 = `yarn run v1.22.19
$ jest --config .tooling/jest-configuration/tooling.config.js --json
{"numFailedTestSuites":0,"numFailedTests":0,"numPassedTestSuites":1,"numPassedTests":4,"numPendingTestSuites":0,"numPendingTests":0,"numRuntimeErrorTestSuites":0,"numTodoTests":0,"numTotalTestSuites":1,"numTotalTests":4,"openHandles":[],"snapshot":{"added":0,"didUpdate":false,"failure":false,"filesAdded":0,"filesRemoved":0,"filesRemovedList":[],"filesUnmatched":0,"filesUpdated":0,"matched":0,"total":0,"unchecked":0,"uncheckedKeysByFile":[],"unmatched":0,"updated":0},"startTime":1687119130402,"success":true,"testResults":[{"assertionResults":[{"ancestorTitles":["Feature: FeatureFileFromTestUsecase","Scenario: Happy Path","Given jest payload is correct","When its passed to the parser"],"duration":4,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: Happy Path Given jest payload is correct When its passed to the parser Then it converts test file path the .feature path","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"Then it converts test file path the .feature path"},{"ancestorTitles":["Feature: FeatureFileFromTestUsecase","Scenario: Happy Path","Given jest payload is correct","And its passed to the parser"],"duration":0,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: Happy Path Given jest payload is correct When its passed to the parser And computes the gherkin file content","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"And computes the gherkin file content"},{"ancestorTitles":["Feature: FeatureFileFromTestUsecase","Scenario: trying to parse bad jest output","Given jest payload is corrupted","When its passed to the parser"],"duration":10,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: trying to parse bad jest output Given jest payload is corrupted When its passed to the parser Then opration is rejected","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"Then opration is rejected"},{"ancestorTitles":["Feature: FeatureFileFromTestUsecase","Scenario: trying to create a bdd test from a test that does not respect gherkin","\\n    Given jest payload is correct\\n    And gherkin syntax is not repected\\n    ","When its passed to the parser"],"duration":1,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: trying to create a bdd test from a test that does not respect gherkin \\n    Given jest payload is correct\\n    And gherkin syntax is not repected\\n     When its passed to the parser Then operation is rejected","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"Then operation is rejected"}],"endTime":1687119139184,"message":"","name":"/.tooling/code-generators/bdd/feature-file-from-test.use-case.spec.ts","startTime":1687119130477,"status":"passed","summary":""}],"wasInterrupted":false}
Done in 10.24s.
`;

const correctJestOutputFixture = `yarn run v1.22.19
$ jest --config .tooling/jest-configuration/tooling.config.js --json
{"numFailedTestSuites":0,"numFailedTests":0,"numPassedTestSuites":1,"numPassedTests":4,"numPendingTestSuites":0,"numPendingTests":0,"numRuntimeErrorTestSuites":0,"numTodoTests":0,"numTotalTestSuites":1,"numTotalTests":4,"openHandles":[],"snapshot":{"added":0,"didUpdate":false,"failure":false,"filesAdded":0,"filesRemoved":0,"filesRemovedList":[],"filesUnmatched":0,"filesUpdated":0,"matched":0,"total":0,"unchecked":0,"uncheckedKeysByFile":[],"unmatched":0,"updated":0},"startTime":1687119130402,"success":true,"testResults":[{"assertionResults":[{"ancestorTitles":["Feature: FeatureFileFromTestUsecase","Scenario: Happy Path","Given jest payload is correct","When its passed to the parser"],"duration":4,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: Happy Path Given jest payload is correct When its passed to the parser Then it converts test file path the .feature path","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"Then it converts test file path the .feature path"},{"ancestorTitles":["Feature: FeatureFileFromTestUsecase","Scenario: Happy Path","Given jest payload is correct","When its passed to the parser"],"duration":0,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: Happy Path Given jest payload is correct When its passed to the parser And computes the gherkin file content","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"And computes the gherkin file content"},{"ancestorTitles":["Feature: FeatureFileFromTestUsecase","Scenario: trying to parse bad jest output","Given jest payload is corrupted","When its passed to the parser"],"duration":10,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: trying to parse bad jest output Given jest payload is corrupted When its passed to the parser Then opration is rejected","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"Then opration is rejected"},{"ancestorTitles":["Feature: FeatureFileFromTestUsecase","Scenario: trying to create a bdd test from a test that does not respect gherkin","\\n    Given jest payload is correct\\n    And gherkin syntax is not repected\\n    ","When its passed to the parser"],"duration":1,"failureDetails":[],"failureMessages":[],"fullName":"Feature: FeatureFileFromTestUsecase Scenario: trying to create a bdd test from a test that does not respect gherkin \\n    Given jest payload is correct\\n    And gherkin syntax is not repected\\n     When its passed to the parser Then operation is rejected","invocations":1,"location":null,"numPassingAsserts":1,"retryReasons":[],"status":"passed","title":"Then operation is rejected"}],"endTime":1687119139184,"message":"","name":"/.tooling/code-generators/bdd/feature-file-from-test.use-case.spec.ts","startTime":1687119130477,"status":"passed","summary":""}],"wasInterrupted":false}
Done in 10.24s.
`;

const expectedGerkin = `Feature: FeatureFileFromTestUsecase

  Scenario: Happy Path

    Given jest payload is correct

    When its passed to the parser

    Then it converts test file path the .feature path
    And computes the gherkin file content

  Scenario: trying to parse bad jest output

    Given jest payload is corrupted

    When its passed to the parser

    Then opration is rejected

  Scenario: trying to create a bdd test from a test that does not respect gherkin

    Given jest payload is correct
    And gherkin syntax is not repected

    When its passed to the parser

    Then operation is rejected
`;

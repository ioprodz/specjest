import { TestFileFromFeatureUsecase } from "./test-file-from-feature.use-case";

feature("BDD ⭐ Test file from feature", () => {
  const usecase = new TestFileFromFeatureUsecase();

  scenario("🎉 Happy path 😀", () => {
    given("Given the input is correct gherkin feature definition", () => {
      when("When we pass it to the use-case", () => {
        then(
          ["it generates jest test suite content with assertions to do"],
          () => {
            const result = usecase.execute({
              filePath: "/test/do-somthing.feature",
              gherkin: inputGherkinFixture,
            });
            expect(result.content).toBe(expectedOutputTest);
            expect(result.filePath).toBe("/test/do-somthing.spec.ts");
          }
        );
      });
    });
  });

  scenario("feed incorrect gherkin", () => {
    given("🙅 the input is incorrect gherkin", () => {
      when("we pass it to the use-case", () => {
        then("operation is rejected", () => {
          expect(() =>
            usecase.execute({
              filePath: "/test/do-somthing.feature",
              gherkin: `
              Scenario: lol
              Test of feature
              Given somthing
              Then do somthing
            `,
            })
          ).toThrow();
        });
      });
    });
  });
});

const inputGherkinFixture = `Feature: FeatureFileFromTestUsecase

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

const expectedOutputTest = `
describe(\`Feature: FeatureFileFromTestUsecase\`, () => {

  describe(\`Scenario: Happy Path\`, () => {
    describe(\`Given jest payload is correct\`, () => {
      describe(\`When its passed to the parser\`, () => {
        test.todo(\`Then it converts test file path the .feature path\`);
        test.todo(\`And computes the gherkin file content\`);
      });
    });
  });

  describe(\`Scenario: trying to parse bad jest output\`, () => {
    describe(\`Given jest payload is corrupted\`, () => {
      describe(\`When its passed to the parser\`, () => {
        test.todo(\`Then opration is rejected\`);
      });
    });
  });

  describe(\`Scenario: trying to create a bdd test from a test that does not respect gherkin\`, () => {
    describe(\`Given jest payload is correct
And gherkin syntax is not repected\`, () => {
      describe(\`When its passed to the parser\`, () => {
        test.todo(\`Then operation is rejected\`);
      });
    });
  });

});
`;

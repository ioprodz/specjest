# 😎 SpecJest

A simple CLI tool that allows conversion from .feature (gherkin) syntax to Jest test file, and the inverse (ie from a test, generate feature files).

## 🧩 Usage:

Pre-requisites: [Jest](https://jestjs.io/docs/getting-started)

Install as dev dependency:

```bash
npm install specjest --save-dev
```

or use directly as a globally installed package

```bash
npx specjest <command>
```

⏩ Convert gherkin (.feature) to a todo test file

Create a .feature file:

```gherkin
Feature: Create User Command

  Scenario: Happy path - new user

    Given a non-existing user
    And avatar_url is set
    And name is set
    And email is set
    And selected_project_id is null

    When user data is sumbitted

    Then user is persisted to DB
    And user created event is dispatched
```

```bash
npx specjest test <path/to/file.feature>
```

Result: a Jest test is created with all the tests set to "todo"

```typescript
describe(`Feature: Create User Command`, () => {
  describe(`Scenario: Happy path - new user`, () => {
    describe(`Given a non-existing user
              And avatar_url is set
              And name is set
              And email is set
              And selected_project_id is null`, () => {
      describe(`When user data is sumbitted`, () => {
        test.todo(`Then user is persisted to DB`);
        test.todo(`And user created event is dispatched`);
      });
    });
  });
});
```

⏩ Convert behavioural jest tests to a gherkin (.feature)

⚙️ Run all tests and generate feature files:

This basically consists of adding --json directive to you jest command and piping it into Specjest, if your tests contain correct gherkin syntax they will be processed.

```bash
<your-jest-command> --json | npx specjest feat
```

example `yarn test:spec --json | npx specjest feat`

⚙️ To generate for specific path or test pattern:

```bash
<your-jest-command> <testRegex> --json | npx specjest feat
```

Note: depending on your pacakge.json configuration, you may need to adjust these commands to take into consideration the project's jest configuration.

Result : Specjest will report on all test files processed and the outcome

```
✅ Successfully written feature files:

  📄 src/app/emails/use-cases/sync-all-command/sync-all.feature

❌ Failed to parse tests:

  📄 src/app/email/model/validation.test.ts
    💬 cannot determine type of Bdd Description: should...

✨  Done in 0.62s.
```

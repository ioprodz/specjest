import { FeatureFileFromTestUsecase } from "./behavioural-testing/feature-file-from-test/feature-file-from-test.use-case";
import { TestFileFromFeatureUsecase } from "./behavioural-testing/test-file-from-feature/test-file-from-feature.use-case";

import { Cli } from "./infra/cli.infra";
import {
  readFileSync,
  toRelativePath,
  writeFileAndFeedback,
} from "./infra/file-system.infra";

const [command, ...commandParams] = Cli.getProcessArguments();
const main = (): void => {
  switch (command) {
    case "feat":
      handleGetFeature();
      break;
    case "test":
      const [filePath] = commandParams;
      handleGetTest(filePath);
      break;
    default:
      printHelp();
  }
};

main();

function printHelp() {
  console.log(`
# 😎 SpecJest

  ## 🧩 Features:

    ⏩ Convert gherkin (.feature) to a todo test file

      $ npm specjest test <path/to/file.feature>
  
    ⏩ Convert behavioural jest tests to a gherkin (.feature)

      ⚙️ Run all tests and generate feature files:
        $ npm jest --json | npm specjest feat

      ⚙️ To generate for specific path or test pattern:
        $ npm jest <testRegex> --json | npm specjest feat
        $ npm jest <testRegex> --json | npm specjest feat

    Note: depending on your pacakge.json configuration, you may need to adjust 
          these commands to take into consideration the project's jest configuration.
`);
}

function handleGetTest(filePath: string) {
  const getTestFromFeature = new TestFileFromFeatureUsecase();
  const gherkin = readFileSync(filePath);
  const { filePath: testFilePath, content } = getTestFromFeature.execute({
    filePath,
    gherkin,
  });
  console.log("\n\n✅ Successfully written test file:\n");

  writeFileAndFeedback(testFilePath, content);
  console.log(
    `\n🧪 start in TDD mode: yarn test:spec ${toRelativePath(
      testFilePath
    )} --watch --verbose`
  );
}

async function handleGetFeature() {
  const getFeatureFromTest = new FeatureFileFromTestUsecase();
  await Cli.streamSession(async (cli) => {
    const jestOutput = await cli.getContent();
    const { successful, failed } = getFeatureFromTest.execute(jestOutput);
    if (successful.length > 0) {
      console.log("\n\n✅ Successfully written feature files:\n");
      successful.forEach(({ filePath, content }) => {
        writeFileAndFeedback(filePath, content);
      });
    }
    if (failed.length > 0) {
      console.log("\n\n❌ Failed to parse tests:\n");
      failed.forEach(({ filePath, content }) => {
        console.log(`  📄 ${toRelativePath(filePath)}`);
        console.log(`    💬 ${content}`);
      });
    }
  });
}

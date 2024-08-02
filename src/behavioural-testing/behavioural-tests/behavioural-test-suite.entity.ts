import { BehaviouralTestDescription } from './behavioural-test-description.value';
import {
  TestScenarioList,
  TestScenario,
} from './behavioural-test-scenario.entity';
import { SerializableBehaviouralTest } from './serializable.interface';

type BehaviouralTestSuiteProps = {
  testPath: string;
  featureName: BehaviouralTestDescription;
  scenarios: TestScenarioList;
};

export class BehaviouralTestSuite implements SerializableBehaviouralTest {
  private props: BehaviouralTestSuiteProps;

  private constructor(props: BehaviouralTestSuiteProps) {
    this.props = props;
  }

  get testPath() {
    return this.props.testPath;
  }

  toGherkin() {
    return `${this.props.featureName.toGherkin()}
${this.props.scenarios.list.map((s) => s.toGherkin()).join('\n')}
`;
  }

  toJestTestSuite(): string {
    return `
describe(\`${this.props.featureName.toJestTestSuite()}\`, () => {

  ${this.props.scenarios.list.map((s) => s.toJestTestSuite()).join('\n  ')}
});
`;
  }

  public static createWithAssertions(props: {
    testPath: string;
    assertions: string[][];
  }) {
    const { testPath, assertions } = props;
    const scenarios = new TestScenarioList();
    assertions.forEach((scenarioAssertions) => {
      scenarios.add(TestScenario.fromAssertions(scenarioAssertions));
    });

    const bddTest = new BehaviouralTestSuite({
      testPath,
      featureName: BehaviouralTestDescription.create(assertions[0][0]),
      scenarios,
    });
    return bddTest;
  }
}

import {
  BehaviouralTestDescription,
  BehaviouralTestDescriptionType,
} from './behavioural-test-description.value';
import { SerializableBehaviouralTest } from './serializable.interface';

type TestScenarioProps = {
  scenarioName: BehaviouralTestDescription;
  preConditions: BehaviouralTestDescription[];
  actions: BehaviouralTestDescription[];
  postConditions: BehaviouralTestDescription[];
};

export class TestScenario implements SerializableBehaviouralTest {
  private props: TestScenarioProps;
  private constructor(props: TestScenarioProps) {
    this.props = props;
  }

  merge(scenario: TestScenario) {
    this.props.postConditions = [
      ...this.props.postConditions,
      ...scenario.props.postConditions,
    ];
  }

  equals(scenario: TestScenario): boolean {
    return this.props.scenarioName.value === scenario.props.scenarioName.value;
  }

  toGherkin() {
    return `
${this.props.scenarioName.toGherkin()}

${this.props.preConditions.map((i) => i.toGherkin()).join('\n')}

${this.props.actions.map((i) => i.toGherkin()).join('\n')}

${this.props.postConditions.map((i) => i.toGherkin()).join('\n')}`;
  }

  toJestTestSuite(): string {
    return `describe(\`${this.props.scenarioName.toJestTestSuite()}\`, () => {
    describe(\`${this.props.preConditions
      .map((i) => i.toJestTestSuite())
      .join('\n')}\`, () => {
      describe(\`${this.props.actions
        .map((i) => i.toJestTestSuite())
        .join('\n')}\`, () => {
        ${this.props.postConditions
          .map((i, index) => {
            return `${
              index > 0 ? '        ' : ''
            }test.todo(\`${i.toJestTestSuite()}\`);`;
          })
          .join('\n')}
      });
    });
  });
`;
  }

  static fromAssertions(assertions: string[]) {
    const givenWhenThen = assertions.slice(2);
    const preConditions: BehaviouralTestDescription[] = [];
    const actions: BehaviouralTestDescription[] = [];
    const postConditions: BehaviouralTestDescription[] = [];
    let phase: BehaviouralTestDescriptionType;
    givenWhenThen.forEach((statement, statementIndex) => {
      const desc = BehaviouralTestDescription.create(statement);
      if (desc.type !== BehaviouralTestDescriptionType.And && desc.type !== BehaviouralTestDescriptionType.But) {
        phase = desc.type;
      }
      if (statementIndex === givenWhenThen.length - 1) {
        postConditions.push(desc);
        return;
      }
      switch (phase) {
        case BehaviouralTestDescriptionType.Given:
          preConditions.push(desc);
          break;
        case BehaviouralTestDescriptionType.When:
          actions.push(desc);
          break;
        case BehaviouralTestDescriptionType.Then:
          postConditions.push(desc);
          break;
      }
    });

    const truncate = (str: string, len: number) =>
      str.length > len ? str.slice(0, len) + '...' : str;

    if (preConditions.length === 0) {
      const found = givenWhenThen[0] || assertions[1] || assertions[0];
      throw new Error(
        `Expected "Given ..." but found "${truncate(found, 20)}"`
      );
    }
    if (actions.length === 0) {
      const found = givenWhenThen.find(s => !s.startsWith('Given') && !s.startsWith('And') && !s.startsWith('But')) || givenWhenThen[1];
      throw new Error(
        `Expected "When ..." but found "${truncate(found || '', 20)}"`
      );
    }

    return new TestScenario({
      scenarioName: BehaviouralTestDescription.create(assertions[1]),
      preConditions,
      actions,
      postConditions,
    });
  }
}

export class TestScenarioList {
  list: TestScenario[] = [];
  add(scenario: TestScenario) {
    const existing = this.list.find((s) => s.equals(scenario));
    if (existing) {
      existing.merge(scenario);
    } else {
      this.list.push(scenario);
    }
  }
}

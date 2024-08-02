export interface SerializableBehaviouralTest {
  toGherkin(): string;
  toJestTestSuite(): string;
}

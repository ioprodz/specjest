import { SerializableBehaviouralTest } from './serializable.interface';

export enum BehaviouralTestDescriptionType {
  Feature = 'Feature',
  Scenario = 'Scenario',
  Given = 'Given',
  When = 'When',
  Then = 'Then',
  And = 'And',
  But = 'But',
}

const BddDescriptionTypeFormatting: Record<
  BehaviouralTestDescriptionType,
  { literal: string; indent: number }
> = {
  Feature: { literal: 'Feature:', indent: 0 },
  Scenario: { literal: 'Scenario:', indent: 2 },
  Given: { literal: 'Given', indent: 4 },
  When: { literal: 'When', indent: 4 },
  Then: { literal: 'Then', indent: 4 },
  And: { literal: 'And', indent: 4 },
  But: { literal: 'But', indent: 4 },
};

export class BehaviouralTestDescription implements SerializableBehaviouralTest {
  public readonly type: BehaviouralTestDescriptionType;
  public readonly value: string;

  private constructor(type: BehaviouralTestDescriptionType, value: string) {
    this.type = type;
    this.value = value;
  }

  toGherkin(): string {
    const { literal, indent } = BddDescriptionTypeFormatting[this.type];
    const indenting = new Array(indent + 1).join(' ');
    return `${indenting}${literal} ${this.value}`;
  }

  toJestTestSuite(): string {
    const { literal } = BddDescriptionTypeFormatting[this.type];
    return `${literal} ${this.value}`;
  }

  static create(value: string): BehaviouralTestDescription {
    let type: BehaviouralTestDescriptionType | undefined = undefined;
    for (const availableType in BehaviouralTestDescriptionType) {
      const { literal } =
        BddDescriptionTypeFormatting[
          availableType as BehaviouralTestDescriptionType
        ];
      if (value.slice(0, literal.length) === literal) {
        type = availableType as BehaviouralTestDescriptionType;
      }
    }

    if (!type) {
      throw new Error(`cannot determine type of Bdd Description: ${value}`);
    }

    return new BehaviouralTestDescription(
      type,
      value.slice(BddDescriptionTypeFormatting[type].literal.length).trim(),
    );
  }
}

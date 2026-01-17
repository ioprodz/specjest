Feature: 🚀 BDD ⭐ Feature file from test usecase

  Scenario: 🎉 Happy path 😀

    Given jest payload is correct

    When ⚡ its passed to the parser

    Then it converts test file path the .feature path
    And generates the gherkin file content
    And gives 0 failed files

  Scenario: trying to parse bad jest output

    Given 🙅 jest payload is corrupted

    When ⚡ its passed to the parser

    Then opration is rejected
    Then helpful error message is shown

  Scenario: bad gherkin syntax - example: "Feator:" instead of "Feature:"

    Given jest payload is correct
    And 🙅 keyword 'Feature:' is mispelled 'Feator:'

    When ⚡ When its passed to the parser

    Then its present in errored files
    And it reports Bdd Description parse error

  Scenario: bad gherkin syntax - unidentified test phase (Given)

    Given jest payload is correct
    And 🙅 a scenario is missing the keyword 'Given'

    When ⚡ When its passed to the parser

    Then its present in errored files
    And it reports phase parse error for Given

  Scenario: bad gherkin syntax - unidentified test phase (When)

    Given jest payload is correct
    And 🙅 a scenario is missing the keyword 'When'

    When ⚡ its passed to the parser

    Then its present in errored files
    And it reports phase parse error for When

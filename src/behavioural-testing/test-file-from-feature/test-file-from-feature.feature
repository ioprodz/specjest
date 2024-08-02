Feature: BDD ⭐ TestFileFromFeature

  Scenario: 🎉 Happy path 😀

    Given the input is correct gherkin feature definition

    When we pass it to the use-case

    Then it generates jest test suite content with assertions to do
    And it computes correct test file path

  Scenario: 🎥 feed incorrect gherkin

    Given 🙅 the input is incorrect gherkin

    When we pass it to the use-case

    Then operation is rejected

/**
 * Description input for BDD helpers. Can be a single string or an array of strings.
 * When an array is provided, the first element is the main description and subsequent
 * elements are automatically prefixed with "And " for proper Gherkin formatting.
 */
type BddDescriptionInput = string | string[];

declare global {
  /**
   * Defines a feature being tested. This is the top-level container for related scenarios.
   * Maps to a Gherkin `Feature:` block.
   *
   * @param name - The feature name/description
   * @param fn - Function containing the scenarios for this feature
   *
   * @example
   * feature("User Authentication", () => {
   *   scenario("Successful login", () => {
   *     // ...
   *   });
   * });
   */
  function feature(name: BddDescriptionInput, fn: jest.EmptyFunction): void;

  /**
   * Defines a specific scenario or use case within a feature.
   * Maps to a Gherkin `Scenario:` block.
   *
   * @param name - The scenario name/description
   * @param fn - Function containing the Given/When/Then steps
   *
   * @example
   * scenario("User logs in with valid credentials", () => {
   *   given("the user is on the login page", () => {
   *     when("they enter valid credentials", () => {
   *       then("they are redirected to the dashboard", () => {
   *         // assertions
   *       });
   *     });
   *   });
   * });
   */
  function scenario(name: BddDescriptionInput, fn: jest.EmptyFunction): void;

  /**
   * Defines preconditions or initial context for a scenario.
   * Maps to a Gherkin `Given` step. Use arrays for multiple preconditions.
   *
   * @param name - The precondition description (string or array of strings)
   * @param fn - Function containing the When/Then steps or setup logic
   *
   * @example
   * // Single precondition
   * given("the user is logged in", () => {
   *   // ...
   * });
   *
   * // Multiple preconditions (automatically adds "And" prefix)
   * given([
   *   "the user is logged in",
   *   "they have admin privileges",
   *   "the feature flag is enabled"
   * ], () => {
   *   // ...
   * });
   */
  function given(name: BddDescriptionInput, fn: jest.EmptyFunction): void;

  /**
   * Defines the action or event being tested within a scenario.
   * Maps to a Gherkin `When` step.
   *
   * @param name - The action description
   * @param fn - Function containing the Then steps or action logic
   *
   * @example
   * when("the user clicks the submit button", () => {
   *   then("the form is submitted", () => {
   *     // assertions
   *   });
   * });
   */
  function when(name: BddDescriptionInput, fn: jest.EmptyFunction): void;

  /**
   * Defines expected outcomes or postconditions. This is where assertions go.
   * Maps to a Gherkin `Then` step. Use arrays for multiple expectations.
   *
   * @param name - The expected outcome description (string or array of strings)
   * @param fn - Test function containing assertions
   * @param timeout - Optional timeout in milliseconds
   *
   * @example
   * // Single expectation
   * then("the user sees a success message", () => {
   *   expect(screen.getByText("Success")).toBeVisible();
   * });
   *
   * // Multiple expectations (automatically adds "And" prefix)
   * then([
   *   "the form is cleared",
   *   "a success toast appears",
   *   "the data is saved to the database"
   * ], () => {
   *   expect(form).toBeEmpty();
   *   expect(toast).toBeVisible();
   *   expect(db.save).toHaveBeenCalled();
   * });
   */
  function then(
    name: BddDescriptionInput,
    fn?: jest.ProvidesCallback,
    timeout?: number
  ): void;
}

export {};

import { useDescribe, useTest } from "./utils/apply-formatting.jest-plugin";

declare global {
  function feature(name: string, fn: jest.EmptyFunction): void;
  function scenario(name: string, fn: jest.EmptyFunction): void;
  function given(name: string, fn: jest.EmptyFunction): void;
  function when(name: string, fn: jest.EmptyFunction): void;
  function then(
    name: string,
    fn?: jest.ProvidesCallback,
    timeout?: number
  ): void;
}

// Indent continuation lines to align with text after the prefix.
// baseIndent: Jest's 2 spaces per nesting level
// prefixLength: length of prefix text (e.g., "Given ", "✓ Then ")
const indentContinuationLines = (text: string, baseIndent: number, prefixLength: number): string => {
  const indent = " ".repeat(baseIndent + prefixLength);
  return text.replace(/\n/g, `\n${indent}`);
};

globalThis.feature = useDescribe(describe, ({ color, bold, description }) =>
  color("magenta", `Feature: ${bold(indentContinuationLines(description, 2, 9))}`)  // "Feature: " = 9 chars
);

globalThis.scenario = useDescribe(describe, ({ color, bold, description }) =>
  color("cyan", `Scenario: ${bold(indentContinuationLines(description, 4, 10))}`)  // "Scenario: " = 10 chars
);

globalThis.given = useDescribe(describe, ({ color, bold, description }) =>
  color("blue", `Given ${bold(indentContinuationLines(description, 6, 6))}`)  // "Given " = 6 chars
);

globalThis.when = useDescribe(describe, ({ color, bold, description }) =>
  color("yellow", `When ${bold(indentContinuationLines(description, 8, 5))}`)  // "When " = 5 chars
);

globalThis.then = useTest(
  it,
  ({ color, bold, description }) =>
    "\x1b[0m" + color("green", `Then ${bold(indentContinuationLines(description, 10, 7))}`)  // "✓ Then " = 7 chars (includes Jest's checkmark)
);

import { useDescribe, useTest } from "./utils/apply-formatting.jest-plugin";
import "./bdd.d";

// Indent continuation lines to align with text after the prefix.
// baseIndent: Jest's 2 spaces per nesting level
// prefixLength: length of prefix text (e.g., "Given ", "✓ Then ")
// Lines starting with "And " get reduced indent (prefixLength - 4) so content aligns
const indentContinuationLines = (text: string, baseIndent: number, prefixLength: number): string => {
  const lines = text.split("\n");
  return lines
    .map((line, index) => {
      if (index === 0) return line;
      const indent = line.startsWith("And ")
        ? " ".repeat(baseIndent + prefixLength - 4)
        : " ".repeat(baseIndent + prefixLength);
      return indent + line;
    })
    .join("\n");
};

globalThis.feature = useDescribe(describe, ({ color, bold, description }) =>
  color("magenta", `Feature: ${bold(indentContinuationLines(description, 2, 9))}`)  // "Feature: " = 9 chars
) as any;

globalThis.scenario = useDescribe(describe, ({ color, bold, description }) =>
  color("cyan", `Scenario: ${bold(indentContinuationLines(description, 4, 10))}`)  // "Scenario: " = 10 chars
) as any;

globalThis.given = useDescribe(describe, ({ color, bold, description }) =>
  color("blue", `Given ${bold(indentContinuationLines(description, 6, 6))}`)  // "Given " = 6 chars
) as any;

globalThis.when = useDescribe(describe, ({ color, bold, description }) =>
  color("yellow", `When ${bold(indentContinuationLines(description, 8, 5))}`)  // "When " = 5 chars
) as any;

globalThis.then = useTest(
  it,
  ({ color, bold, description }) =>
    "\x1b[0m" + color("green", `Then ${bold(indentContinuationLines(description, 10, 7))}`)  // "✓ Then " = 7 chars (includes Jest's checkmark)
) as any;

globalThis.but = useDescribe(describe, ({ color, bold, description }) =>
  color("red", `But ${bold(indentContinuationLines(description, 10, 4))}`)  // "But " = 4 chars
) as any;

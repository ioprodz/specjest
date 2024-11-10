import { applyFormatting } from "./utils/apply-formatting.jest-plugin";

declare global {
  function feature(desc: string | string[], fn: () => void): void;
  function scenario(desc: string | string[], fn: () => void): void;
  function given(desc: string | string[], fn: () => void): void;
  function when(desc: string | string[], fn: () => void): void;
  function then(desc: string | string[], fn: () => void): void;
}

globalThis.feature = applyFormatting(describe, ({ color, bold, description }) =>
  color("magenta", `Feature: 🚀 ${bold(description)}`)
);

globalThis.scenario = applyFormatting(
  describe,
  ({ color, bold, description }) =>
    color("cyan", `Scenario: ${bold(description)}`)
);

globalThis.given = applyFormatting(
  describe,
  ({ color, bold, description, index }) =>
    color(
      "green",
      `${index === 0 ? "Given" : "And".padEnd(5).padStart(11)} ${bold(
        description
      )}`
    )
);

globalThis.when = applyFormatting(
  describe,
  ({ color, bold, description, index }) =>
    color(
      "yellow",
      `${index === 0 ? "When" : "And".padEnd(5).padStart(13)} ⚡ ${bold(
        description
      )}`
    )
);

globalThis.then = applyFormatting(it, ({ color, bold, description, index }) =>
  color(
    "blue",
    `${index === 0 ? "Then" : "And".padEnd(4).padStart(16)} ${bold(
      description
    )}`
  )
);

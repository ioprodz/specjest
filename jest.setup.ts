import { useDescribe, useTest } from "./src/utils/apply-formatting.jest-plugin";

declare global {
  function feature(name: JestFnInput, fn: jest.EmptyFunction): void;
  function scenario(name: JestFnInput, fn: jest.EmptyFunction): void;
  function given(name: JestFnInput, fn: jest.EmptyFunction): void;
  function when(name: JestFnInput, fn: jest.EmptyFunction): void;
  function then(
    name: string,
    fn?: jest.ProvidesCallback,
    timeout?: number
  ): void;
}
type JestFnInput = string | number | Function | jest.FunctionLike;

globalThis.feature = useDescribe(describe, ({ color, bold, description }) =>
  color("magenta", `Feature: 🚀 ${bold(description)}`)
);

globalThis.scenario = useDescribe(describe, ({ color, bold, description }) =>
  color("cyan", `Scenario: ${bold(description)}`)
);

globalThis.given = useDescribe(describe, ({ color, bold, description }) =>
  color("blue", `Given ${bold(description)}`)
);

globalThis.when = useDescribe(describe, ({ color, bold, description }) =>
  color("yellow", `When ⚡ ${bold(description)}`)
);

globalThis.then = useTest(
  it,
  ({ color, bold, description }) =>
    "\x1b[0m" + color("green", `Then ${bold(description)}`)
);

globalThis.describe = useDescribe(describe, ({ color, bold, description }) =>
  color("yellow", `${bold(description)}`)
);

globalThis.it = useTest(
  it,
  ({ color, bold, description }) =>
    "\x1b[0m" + color("green", `${bold(description)}`)
);

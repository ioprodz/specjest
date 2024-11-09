import { bddExpression } from "./src/utils/jest-bdd-expression";

globalThis.feature = bddExpression({
  expression: "Feature:",
  color: "magenta",
  icon: "🚀",
  jestFn: describe,
});

globalThis.scenario = bddExpression({
  expression: "Scenario:",
  color: "cyan",
  jestFn: describe,
});

globalThis.given = bddExpression({
  expression: "Given",
  color: "green",
  jestFn: describe,
  andPadding: 5,
});

globalThis.when = bddExpression({
  expression: "When",
  color: "yellow",
  icon: "⚡",
  jestFn: describe,
});

globalThis.then = bddExpression({
  expression: "Then",
  color: "blue",
  andPadding: 11,
  jestFn: it,
});

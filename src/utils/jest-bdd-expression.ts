declare global {
  function feature(desc: string | string[], fn: () => void): void;
  function scenario(desc: string | string[], fn: () => void): void;
  function given(desc: string | string[], fn: () => void): void;
  function when(desc: string | string[], fn: () => void): void;
  function then(desc: string | string[], fn: () => void): void;
}

type ColorName =
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white";
const colors: Record<ColorName, number> = {
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
};

interface BddExpressionProps {
  expression: string;
  jestFn: typeof describe | typeof it;
  icon?: string;
  color?: ColorName;
  andPadding?: number;
}

export function bddExpression(props: BddExpressionProps) {
  const expressionLength = props.expression.length;

  const applyColor = (str: string) => {
    if (!props.color) return str;
    return `\x1b[${colors[props.color]}m${str}\x1b[0m`;
  };
  const applyIcon = (str: string) => {
    if (!props.icon) return str;
    return `${props.icon} ${str}`;
  };

  const applyPadding = (str: string, padLeft: number) => {
    return `${str
      .padEnd(expressionLength)
      .padStart(expressionLength + padLeft + 1)}`;
  };

  const applyBold = (expression: string) => `\x1b[1m${expression}`;

  const expression = props.expression;
  const andExpression = applyPadding("And", props.andPadding ?? 0);

  const formatDescription = (desc: string | string[]) => {
    if (!Array.isArray(desc)) {
      desc = [desc];
    }
    return desc
      .map(
        (desc, i) =>
          "\x1b[0m" +
          applyColor(
            `${i > 0 ? andExpression : expression} ${applyIcon(
              applyBold(desc)
            )}`
          )
      )
      .join("\n");
  };

  const { jestFn } = props;
  const newFn = (desc: string | string[], fn: () => void) =>
    jestFn(formatDescription(desc), fn);
  newFn.skip = (desc: string | string[], fn: () => void) =>
    jestFn.skip(formatDescription(desc), fn);
  newFn.only = (desc: string | string[], fn: () => void) =>
    jestFn.only(formatDescription(desc), fn);
  if ("todo" in jestFn) {
    newFn.todo = (desc: string | string[]) =>
      jestFn.todo(formatDescription(desc));
  }
  return newFn;
}

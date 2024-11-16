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

type ColorFn = (color: ColorName, str: string) => string;
export const color: ColorFn = (color, str) =>
  `\x1b[${colors[color]}m${str.replace("\x1b[0m", "")}\x1b[0m`;

type BoldFn = (str: string) => string;
export const bold: BoldFn = (str) =>
  `\x1b[1m${str.replace("\x1b[0m", "")}\x1b[0m`;

export interface FormatterProps {
  description: string;
  color: ColorFn;
  bold: BoldFn;
}

export type FormatterFn = (props: FormatterProps) => string;

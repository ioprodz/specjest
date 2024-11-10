import { bold, color, FormatterFn } from "./cli.formatter";

const formatDescriptions = (
  desc: string | string[],
  formatter: FormatterFn
) => {
  if (!Array.isArray(desc)) {
    desc = [desc];
  }
  const clearStyles = "\x1b[0m";
  return desc
    .map(
      (description, index) =>
        clearStyles +
        formatter({
          description,
          index,
          color,
          bold,
        })
    )
    .join("\n");
};

export function applyFormatting(
  jestFn: typeof describe | typeof it,
  formatter: FormatterFn
) {
  const newFn = (desc: string | string[], fn: () => void) =>
    jestFn(formatDescriptions(desc, formatter), fn);
  newFn.skip = (desc: string | string[], fn: () => void) =>
    jestFn.skip(formatDescriptions(desc, formatter), fn);
  newFn.only = (desc: string | string[], fn: () => void) =>
    jestFn.only(formatDescriptions(desc, formatter), fn);
  if ("todo" in jestFn) {
    newFn.todo = (desc: string | string[]) =>
      jestFn.todo(formatDescriptions(desc, formatter));
  }
  return newFn;
}

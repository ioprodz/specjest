import { bold, color, FormatterFn } from "./cli.formatter";

type DescriptionInput = string | string[];

const normalizeDescription = (input: DescriptionInput): string => {
  if (typeof input === "string") {
    return input;
  }
  return input
    .map((line, index) => (index === 0 ? line : `And ${line}`))
    .join("\n");
};

export function useDescribe(
  describe: jest.Describe,
  formatter: FormatterFn
): jest.Describe {
  const { each, skip, only, ...rest } = describe;
  const newFn = (description: DescriptionInput, fn: () => void) =>
    describe(formatter({ description: normalizeDescription(description), bold, color }), fn);

  newFn.each = describe.each;

  newFn.skip = (description: DescriptionInput, fn: () => void) =>
    skip(formatter({ description: normalizeDescription(description), bold, color }), fn);

  newFn.only = (description: DescriptionInput, fn: () => void) =>
    only(formatter({ description: normalizeDescription(description), bold, color }), fn);

  newFn.each = each;

  Object.entries(rest).forEach(([key, value]) => {
    // @ts-ignore
    newFn[key] = value;
  });
  // @ts-ignore
  return newFn;
}

export function useTest(it: jest.It, formatter: FormatterFn): jest.It {
  const { each, skip, only, todo, ...rest } = it;
  const newFn = (
    description: DescriptionInput,
    fn?: jest.ProvidesCallback,
    timeout?: number
  ) => it(formatter({ description: normalizeDescription(description), bold, color }), fn, timeout);

  newFn.each = it.each;

  newFn.skip = (
    description: DescriptionInput,
    fn?: jest.ProvidesCallback,
    timeout?: number
  ) => skip(formatter({ description: normalizeDescription(description), bold, color }), fn, timeout);

  newFn.only = (
    description: DescriptionInput,
    fn?: jest.ProvidesCallback,
    timeout?: number
  ) => only(formatter({ description: normalizeDescription(description), bold, color }), fn, timeout);

  newFn.todo = (description: DescriptionInput) =>
    todo(formatter({ description: normalizeDescription(description), bold, color }));

  newFn.each = each;

  Object.entries(rest).forEach(([key, value]) => {
    // @ts-ignore
    newFn[key] = value;
  });
  // @ts-ignore
  return newFn;
}

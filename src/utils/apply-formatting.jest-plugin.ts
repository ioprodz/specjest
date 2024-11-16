import { bold, color, FormatterFn } from "./cli.formatter";

type DescriptionInput = string;

export function useDescribe(
  describe: jest.Describe,
  formatter: FormatterFn
): jest.Describe {
  const { each, skip, only, ...rest } = describe;
  const newFn = (description: DescriptionInput, fn: () => void) =>
    describe(formatter({ description, bold, color }), fn);

  newFn.each = describe.each;

  newFn.skip = (description: DescriptionInput, fn: () => void) =>
    skip(formatter({ description, bold, color }), fn);

  newFn.only = (description: DescriptionInput, fn: () => void) =>
    only(formatter({ description, bold, color }), fn);

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
  const newFn = (description: DescriptionInput, fn: () => void) =>
    it(formatter({ description, bold, color }), fn);

  newFn.each = it.each;

  newFn.skip = (description: DescriptionInput, fn: () => void) =>
    skip(formatter({ description, bold, color }), fn);

  newFn.only = (description: DescriptionInput, fn: () => void) =>
    only(formatter({ description, bold, color }), fn);

  newFn.todo = (description: DescriptionInput) =>
    todo(formatter({ description, bold, color }));

  newFn.each = each;

  Object.entries(rest).forEach(([key, value]) => {
    // @ts-ignore
    newFn[key] = value;
  });
  // @ts-ignore
  return newFn;
}

import { useDescribe, useTest } from "./apply-formatting.jest-plugin";

describe("applyFormatting", () => {
  const mockIt: any = jest.fn();
  mockIt.each = jest.fn();
  mockIt.skip = jest.fn();
  mockIt.only = jest.fn();
  mockIt.todo = jest.fn();

  const formatter = jest.fn(({ description }) => "formatted " + description);
  const testImplFn = jest.fn();
  const newDescribeFn = useDescribe(mockIt as any, formatter);
  const newTestFn = useTest(mockIt as any, formatter);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applies formatting on function", () => {
    // act
    newDescribeFn("description", testImplFn);
    // Assert
    expect(mockIt).toHaveBeenCalledWith("formatted description", testImplFn);
  });

  it("applies formatting on .skip", () => {
    // act
    newDescribeFn.skip("description", testImplFn);
    // Assert
    expect(mockIt.skip).toHaveBeenCalledWith(
      "formatted description",
      testImplFn
    );
  });

  it("applies formatting on .only", () => {
    // act
    newDescribeFn.only("description", testImplFn);
    // Assert
    expect(mockIt.only).toHaveBeenCalledWith(
      "formatted description",
      testImplFn
    );
  });

  it("applies formatting on .todo", () => {
    // act
    newTestFn.todo("description");
    // Assert
    expect(mockIt.todo).toHaveBeenCalledWith("formatted description");
  });
});

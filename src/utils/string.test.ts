import { padStart } from "./string";

describe("padStart", () => {
  it("pads string with spaces by default", () => {
    expect(padStart("abc", 6)).toBe("   abc");
  });

  it("pads string with given pad string", () => {
    expect(padStart("abc", 6, "123")).toBe("123abc");
  });

  it("returns original string if target length is less than or equal to string length", () => {
    expect(padStart("abc", 3)).toBe("abc");
  });
});

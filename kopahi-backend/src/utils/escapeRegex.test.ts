import { describe, it, expect } from "vitest";
import escapeRegex from "./escapeRegex";

describe("escapeRegex", () => {
  it("returns plain strings unchanged", () => {
    expect(escapeRegex("kopahi tea")).toBe("kopahi tea");
  });

  it("escapes every regex metacharacter", () => {
    expect(escapeRegex(".+?*^$()|[]{}\\")).toBe("\\.\\+\\?\\*\\^\\$\\(\\)\\|\\[\\]\\{\\}\\\\");
  });

  it("coerces null/undefined to empty string", () => {
    expect(escapeRegex(null)).toBe("");
    expect(escapeRegex(undefined)).toBe("");
  });

  it("produces a string usable in a literal RegExp match", () => {
    const userInput = "tea.*";
    const re = new RegExp(escapeRegex(userInput));
    expect(re.test("tea.*premium")).toBe(true);
    expect(re.test("teaxxpremium")).toBe(false);
  });

  it("blocks ReDoS-style catastrophic patterns", () => {
    const evil = "(a+)+$";
    const re = new RegExp(escapeRegex(evil));
    // The string must be matched literally, so this should NOT freeze.
    expect(re.test("(a+)+$")).toBe(true);
    expect(re.test("aaaaaaaaa")).toBe(false);
  });
});

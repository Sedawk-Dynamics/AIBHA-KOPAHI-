import { describe, it, expect } from "vitest";
import { validatePassword, MIN_LENGTH } from "./passwordPolicy";

describe("validatePassword", () => {
  it("rejects non-strings", () => {
    expect(validatePassword(undefined)).toEqual({
      ok: false,
      reason: "Password is required",
    });
    expect(validatePassword(123 as unknown)).toEqual({
      ok: false,
      reason: "Password is required",
    });
  });

  it(`rejects passwords shorter than ${MIN_LENGTH}`, () => {
    expect(validatePassword("Aa1!short")).toMatchObject({
      ok: false,
      reason: expect.stringContaining("at least 12 characters"),
    });
  });

  it("rejects passwords without a lowercase letter", () => {
    expect(validatePassword("AAAA1234!@#$")).toMatchObject({
      ok: false,
      reason: expect.stringContaining("lowercase"),
    });
  });

  it("rejects passwords without an uppercase letter", () => {
    expect(validatePassword("aaaa1234!@#$")).toMatchObject({
      ok: false,
      reason: expect.stringContaining("uppercase"),
    });
  });

  it("rejects passwords without a digit", () => {
    expect(validatePassword("Aaaaaaaaaa!@")).toMatchObject({
      ok: false,
      reason: expect.stringContaining("digit"),
    });
  });

  it("rejects passwords without a symbol", () => {
    expect(validatePassword("Aaaaaaaaaa12")).toMatchObject({
      ok: false,
      reason: expect.stringContaining("symbol"),
    });
  });

  it("rejects passwords above 128 chars", () => {
    expect(validatePassword("Aa1!" + "x".repeat(130))).toMatchObject({
      ok: false,
      reason: expect.stringContaining("too long"),
    });
  });

  it("accepts a policy-compliant password", () => {
    expect(validatePassword("StrongPass!2026")).toEqual({ ok: true });
  });
});

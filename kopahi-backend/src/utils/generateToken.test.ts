import { describe, it, expect, beforeEach, afterEach } from "vitest";
import jwt from "jsonwebtoken";
import generateToken from "./generateToken";

describe("generateToken", () => {
  let originalSecret: string | undefined;

  beforeEach(() => {
    originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = "test-secret-for-unit-tests-only";
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  it("throws when JWT_SECRET is missing", () => {
    delete process.env.JWT_SECRET;
    expect(() => generateToken({ id: "u1", role: "user" })).toThrow(
      /JWT_SECRET/
    );
  });

  it("encodes id and role into the payload", () => {
    const token = generateToken({ id: "u-cuid", role: "admin" }, "1h");
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };
    expect(decoded).toMatchObject({ id: "u-cuid", role: "admin" });
  });

  it("coerces id to string (numeric ids work too)", () => {
    const token = generateToken({ id: 42 as unknown as string, role: "user" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    expect(decoded.id).toBe("42");
  });

  it("honors the expiresIn parameter (12h short token)", () => {
    const token = generateToken({ id: "u1", role: "user" }, "12h");
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      iat: number;
      exp: number;
    };
    // 12h = 43200 seconds, allow a 5s skew for slow CI runs.
    expect(decoded.exp - decoded.iat).toBeGreaterThan(43_200 - 5);
    expect(decoded.exp - decoded.iat).toBeLessThan(43_200 + 5);
  });
});

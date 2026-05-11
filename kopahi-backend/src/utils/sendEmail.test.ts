import { describe, it, expect } from "vitest";
import { escapeHtml } from "./sendEmail";

describe("escapeHtml", () => {
  it("returns empty string for nullish input", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
    expect(escapeHtml("")).toBe("");
  });

  it("escapes &, <, > and quotes", () => {
    expect(escapeHtml(`<script>alert("xss")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
    );
  });

  it("escapes & before later replacements (no double-encoding)", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
    // Ensure the &-escape doesn't double-escape an existing entity reference.
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });

  it("escapes single-quotes (template-string injection)", () => {
    expect(escapeHtml("it's a test")).toBe("it&#39;s a test");
  });
});

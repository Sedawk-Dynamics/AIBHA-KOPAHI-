import { describe, it, expect } from "vitest";
import { withMongoId, withMongoIds, deepShape } from "./_shape";

describe("withMongoId", () => {
  it("mirrors id onto _id", () => {
    const row = { id: "cuid_123", name: "Tea" };
    const out = withMongoId(row) as { id: string; _id: string; name: string };
    expect(out._id).toBe("cuid_123");
    expect(out.id).toBe("cuid_123");
  });

  it("returns null for null/undefined", () => {
    expect(withMongoId(null)).toBeNull();
    expect(withMongoId(undefined)).toBeNull();
  });

  it("leaves objects without an id field alone", () => {
    const row = { name: "Tea" } as Record<string, unknown> & { id?: string };
    const out = withMongoId(row);
    expect(out).toBeTruthy();
    expect((out as { _id?: string })._id).toBeUndefined();
  });

  it("mutates in place — same reference returned", () => {
    const row = { id: "x", name: "Y" };
    expect(withMongoId(row)).toBe(row);
  });
});

describe("withMongoIds", () => {
  it("mirrors id onto every row", () => {
    const rows = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const out = withMongoIds(rows);
    expect(out.map((r) => (r as { _id: string })._id)).toEqual(["a", "b", "c"]);
  });
});

describe("deepShape", () => {
  it("walks nested objects and attaches _id everywhere id exists", () => {
    const order = {
      id: "ord1",
      user: { id: "u1", name: "Demo" },
      items: [
        { id: "i1", product: { id: "p1", name: "Tea" } },
        { id: "i2", product: { id: "p2", name: "Honey" } },
      ],
    };
    deepShape(order);
    expect((order as { _id: string })._id).toBe("ord1");
    expect((order.user as { _id: string })._id).toBe("u1");
    expect((order.items[0].product as { _id: string })._id).toBe("p1");
    expect((order.items[1].product as { _id: string })._id).toBe("p2");
  });

  it("ignores primitive values inside the object tree", () => {
    const o = { id: "x", count: 5, label: "n/a", flags: [true, false] };
    expect(() => deepShape(o)).not.toThrow();
    expect((o as { _id: string })._id).toBe("x");
  });

  it("handles arrays at the root", () => {
    const arr = [{ id: "a" }, { id: "b" }];
    deepShape(arr);
    expect((arr[0] as { _id: string })._id).toBe("a");
    expect((arr[1] as { _id: string })._id).toBe("b");
  });
});

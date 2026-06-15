import { describe, expect, it } from "vitest";
import { readProjectMetadata, slugify } from "./types";

describe("slugify", () => {
  it("lowercases and separates words with hyphens", () => {
    expect(slugify("Customer Portal")).toBe("customer-portal");
  });

  it("collapses runs of non-alphanumerics", () => {
    expect(slugify("Internal  Tools!!! / Refresh")).toBe(
      "internal-tools-refresh",
    );
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  ---Phase 1---  ")).toBe("phase-1");
  });

  it("returns an empty string for input with no alphanumerics", () => {
    expect(slugify("!!!")).toBe("");
  });
});

describe("readProjectMetadata", () => {
  it("returns the object when it is a JSON object", () => {
    expect(readProjectMetadata({ client: "Acme", phase: "Phase 1" })).toEqual({
      client: "Acme",
      phase: "Phase 1",
    });
  });

  it("degrades to an empty object for null", () => {
    expect(readProjectMetadata(null)).toEqual({});
  });

  it("degrades to an empty object for non-object JSON", () => {
    expect(readProjectMetadata("not-an-object")).toEqual({});
    expect(readProjectMetadata(42)).toEqual({});
    expect(readProjectMetadata(["array", "values"])).toEqual({});
  });
});

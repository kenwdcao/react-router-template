import { describe, expect, it } from "vitest";
import { readFormString } from "./form-data";

describe("readFormString", () => {
  it("returns trimmed strings by default", () => {
    const formData = new FormData();
    formData.set("name", "  Ada  ");

    expect(readFormString(formData, "name")).toBe("Ada");
  });

  it("preserves whitespace when trim is disabled", () => {
    const formData = new FormData();
    formData.set("password", " secret ");

    expect(readFormString(formData, "password", { trim: false })).toBe(
      " secret ",
    );
  });

  it("returns an empty string for missing or non-string values", () => {
    const formData = new FormData();
    formData.set("file", new File(["x"], "x.txt"));

    expect(readFormString(formData, "missing")).toBe("");
    expect(readFormString(formData, "file")).toBe("");
  });
});

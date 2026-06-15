import { describe, expect, it } from "vitest";
import { buildLikeFragment, escapeLikePattern } from "./like";

describe("escapeLikePattern", () => {
  it("escapes backslashes, percent, and underscore", () => {
    expect(escapeLikePattern("a\\b%c_d")).toBe("a\\\\b\\%c\\_d");
  });

  it("leaves ordinary characters untouched", () => {
    expect(escapeLikePattern("Acme Corp 42")).toBe("Acme Corp 42");
  });
});

describe("buildLikeFragment", () => {
  it("wraps the escaped term in SQL wildcards", () => {
    expect(buildLikeFragment("50%off")).toBe("%50\\%off%");
  });

  it("handles an empty string", () => {
    expect(buildLikeFragment("")).toBe("%%");
  });
});

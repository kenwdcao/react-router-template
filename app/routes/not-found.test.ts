import { describe, expect, it } from "vitest";
import { loader } from "./not-found";

function createLoaderArgs(url: string) {
  return { request: new Request(url) } as Parameters<typeof loader>[0];
}

describe("not-found loader", () => {
  it("returns 404 status for normal URLs", () => {
    const result = loader(
      createLoaderArgs("http://localhost/some/unknown/path"),
    );

    expect(result.init?.status).toBe(404);
  });

  it("throws 404 for /api paths", () => {
    expect(() =>
      loader(createLoaderArgs("http://localhost/api/unknown")),
    ).toThrow();
  });

  it("throws 404 for /api exactly", () => {
    expect(() => loader(createLoaderArgs("http://localhost/api"))).toThrow();
  });
});

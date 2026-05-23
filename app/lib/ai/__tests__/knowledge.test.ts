import { describe, expect, it } from "vitest";
import { getProjectKnowledge } from "../knowledge.server";

describe("getProjectKnowledge", () => {
  it("contains required headings", () => {
    const knowledge = getProjectKnowledge();

    expect(knowledge).toContain("## Stack");
    expect(knowledge).toContain("## Scripts");
    expect(knowledge).toContain("## Routes");
    expect(knowledge).toContain("## Auth");
    expect(knowledge).toContain("## Theme");
    expect(knowledge).toContain("## File Layout");
    expect(knowledge).toContain("## Key Conventions");
  });

  it("mentions core technologies", () => {
    const knowledge = getProjectKnowledge();

    expect(knowledge).toContain("React Router");
    expect(knowledge).toContain("Mantine");
    expect(knowledge).toContain("Kysely");
    expect(knowledge).toContain("better-auth");
  });
});

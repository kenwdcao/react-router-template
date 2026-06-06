/**
 * @fileoverview Enforce a maximum number of lines per file.
 * Encourages splitting large modules into smaller, focused units.
 */

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce a maximum number of lines per file",
    },
    schema: [
      {
        type: "object",
        properties: {
          max: { type: "integer" },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      exceed:
        "File has too many lines ({{count}}). Maximum allowed is {{max}}.",
    },
  },
  create(context) {
    const max = context.options[0]?.max ?? 500;
    const filename = context.filename || context.getFilename();
    const normalized = filename.replace(/\\/g, "/");

    // Exemptions: barrel files, test files, generated types, migrations
    if (normalized.endsWith("/index.ts")) {
      return {};
    }
    if (
      normalized.includes("/tests/") ||
      normalized.includes("/test/") ||
      normalized.includes("/__tests__/") ||
      /\.(test|spec)\.[jt]sx?$/.test(normalized)
    ) {
      return {};
    }
    if (normalized.endsWith("/database-types.ts")) {
      return {};
    }
    if (normalized.includes("/prisma/migrations/")) {
      return {};
    }
    if (/\.gen\.[jt]s$/.test(normalized)) {
      return {};
    }
    if (normalized.endsWith(".d.ts")) {
      return {};
    }

    const sourceCode = context.sourceCode;
    const lines = sourceCode.lines.length;
    if (lines > max) {
      context.report({
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
        messageId: "exceed",
        data: { count: lines, max },
      });
    }
    return {};
  },
};

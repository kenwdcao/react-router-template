/**
 * @fileoverview ESLint rule to disallow inline styles in JSX elements.
 * CSS custom properties (variables) are allowed for dynamic values.
 */

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow inline styles in JSX elements (CSS custom properties allowed)",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
    messages: {
      noInlineStyles:
        "Inline styles are not allowed. Use CSS modules or Tailwind. CSS custom properties (e.g., --cell-bg) are allowed for dynamic values only.",
    },
  },
  create(context) {
    /**
     * Strip TypeScript AST wrappers so the rule can inspect the underlying
     * expression. Without this, `style={{ "--x": v } as CSSProperties}` would
     * false-positive because the value node is a TSAsExpression, not an
     * ObjectExpression.
     * @param {import('eslint').Rule.Node} node
     * @returns {import('eslint').Rule.Node}
     */
    function unwrapTSExpression(node) {
      if (
        node.type === "TSAsExpression" ||
        node.type === "TSSatisfiesExpression" ||
        node.type === "TSNonNullExpression"
      ) {
        return unwrapTSExpression(node.expression);
      }
      return node;
    }

    /**
     * Check if a style value object contains only CSS custom properties.
     * @param {import('eslint').Rule.Node} valueNode
     * @returns {boolean}
     */
    function isOnlyCustomProperties(valueNode) {
      const unwrapped = unwrapTSExpression(valueNode);
      if (unwrapped.type === "ObjectExpression") {
        return unwrapped.properties.every((prop) => {
          if (prop.type !== "Property") return false;
          const key =
            prop.key.type === "Identifier"
              ? prop.key.name
              : prop.key.type === "Literal"
                ? String(prop.key.value)
                : "";
          return key.startsWith("--");
        });
      }
      // For spread elements or other expressions, we cannot statically verify
      return false;
    }

    return {
      JSXOpeningElement(node) {
        for (const attr of node.attributes) {
          if (attr.type === "JSXAttribute" && attr.name.name === "style") {
            // Allow if the style value only contains CSS custom properties
            if (attr.value && attr.value.type === "JSXExpressionContainer") {
              if (isOnlyCustomProperties(attr.value.expression)) {
                continue;
              }
            }
            context.report({
              node: attr,
              messageId: "noInlineStyles",
            });
          }
        }
      },
    };
  },
};

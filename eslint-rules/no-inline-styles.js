/**
 * @fileoverview ESLint rule to disallow inline styles in JSX elements.
 * This rule reports any usage of the `style` attribute, regardless of
 * whether the values are literals or dynamic expressions.
 */

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow inline styles in JSX elements",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
    messages: {
      noInlineStyles: "Inline styles are not allowed",
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        for (const attr of node.attributes) {
          if (attr.type === "JSXAttribute" && attr.name.name === "style") {
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

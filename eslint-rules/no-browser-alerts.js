/**
 * @fileoverview ESLint rule to disallow browser-native alert, confirm, and prompt
 * in UI code. These should be replaced with Mantine Modal or Dialog components.
 */

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow browser-native alert, confirm, and prompt in UI code",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
    messages: {
      noBrowserAlerts:
        "Browser-native {{name}}() is forbidden for product UI flows. Use Mantine Modal or Dialog instead.",
    },
  },
  create(context) {
    const forbiddenGlobals = new Set(["alert", "confirm", "prompt"]);

    return {
      CallExpression(node) {
        const callee = node.callee;

        // Direct call: alert(), confirm(), prompt()
        if (callee.type === "Identifier" && forbiddenGlobals.has(callee.name)) {
          context.report({
            node,
            messageId: "noBrowserAlerts",
            data: { name: callee.name },
          });
        }

        // window.alert(), window.confirm(), window.prompt()
        if (
          callee.type === "MemberExpression" &&
          callee.object.type === "Identifier" &&
          callee.object.name === "window" &&
          callee.property.type === "Identifier" &&
          forbiddenGlobals.has(callee.property.name)
        ) {
          context.report({
            node,
            messageId: "noBrowserAlerts",
            data: { name: callee.property.name },
          });
        }
      },
    };
  },
};

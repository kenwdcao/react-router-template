/**
 * @fileoverview ESLint rule to enforce aria-label on interactive elements
 * without visible text, and aria-expanded on disclosure/toggle buttons.
 */

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce aria-label and aria-expanded on interactive elements",
      category: "Accessibility",
      recommended: true,
    },
    schema: [],
    messages: {
      requireAriaLabel:
        "Interactive element without visible text must have an aria-label attribute.",
      requireAriaExpanded:
        "Disclosure/toggle button must have an aria-expanded attribute.",
    },
  },
  create(context) {
    const interactiveTags = new Set([
      "button",
      "a",
      "input",
      "textarea",
      "select",
    ]);

    const mantineInteractive = new Set([
      "Button",
      "ActionIcon",
      "UnstyledButton",
      "Anchor",
      "TextInput",
      "Textarea",
      "PasswordInput",
      "NumberInput",
      "Select",
      "MultiSelect",
      "Checkbox",
      "Radio",
      "Switch",
      "Slider",
    ]);

    const mantineFormControls = new Set([
      "TextInput",
      "Textarea",
      "PasswordInput",
      "NumberInput",
      "Select",
      "MultiSelect",
      "Checkbox",
      "Radio",
      "Switch",
      "Slider",
    ]);

    /**
     * @param {import('eslint').Rule.Node} node
     * @returns {boolean}
     */
    function hasVisibleText(node) {
      if (!node.children || node.children.length === 0) return false;

      return node.children.some((child) => {
        if (child.type === "JSXText") {
          return child.value.trim().length > 0;
        }
        if (child.type === "JSXExpressionContainer") {
          const expr = child.expression;
          // String literal inside expression
          if (expr.type === "Literal" && typeof expr.value === "string") {
            return expr.value.trim().length > 0;
          }
          // Template literal with content
          if (expr.type === "TemplateLiteral") {
            return expr.quasis.some((q) => q.value.raw.trim().length > 0);
          }
        }
        return false;
      });
    }

    /**
     * @param {import('eslint').Rule.Node[]} attributes
     * @param {string} name
     * @returns {boolean}
     */
    function hasAttribute(attributes, name) {
      return attributes.some(
        (attr) => attr.type === "JSXAttribute" && attr.name.name === name,
      );
    }

    /**
     * @param {import('eslint').Rule.Node[]} attributes
     * @param {string} tagName
     * @returns {boolean}
     */
    function hasAccessibleNameAttribute(attributes, tagName) {
      return (
        hasAttribute(attributes, "aria-label") ||
        hasAttribute(attributes, "aria-labelledby") ||
        hasAttribute(attributes, "title") ||
        (mantineFormControls.has(tagName) && hasAttribute(attributes, "label"))
      );
    }

    /**
     * @param {import('eslint').Rule.Node[]} attributes
     * @returns {boolean}
     */
    function isDisabled(attributes) {
      return attributes.some(
        (attr) =>
          attr.type === "JSXAttribute" &&
          attr.name.name === "disabled" &&
          (!attr.value ||
            (attr.value.type === "JSXExpressionContainer" &&
              attr.value.expression.type === "Literal" &&
              attr.value.expression.value === true)),
      );
    }

    return {
      JSXOpeningElement(node) {
        const name = node.name;
        let tagName = "";

        if (name.type === "JSXIdentifier") {
          tagName = name.name;
        } else if (
          name.type === "JSXMemberExpression" &&
          name.object.type === "JSXIdentifier"
        ) {
          // Handle Mantine component names like Menu.Item
          tagName = name.object.name;
        }

        const isInteractive =
          interactiveTags.has(tagName) || mantineInteractive.has(tagName);

        if (!isInteractive) return;

        // Skip disabled elements
        if (isDisabled(node.attributes)) return;

        // Check aria-label on elements without visible text
        const parent = node.parent;
        if (parent && parent.type === "JSXElement" && !hasVisibleText(parent)) {
          if (!hasAccessibleNameAttribute(node.attributes, tagName)) {
            context.report({
              node,
              messageId: "requireAriaLabel",
            });
          }
        }

        // Check aria-expanded on disclosure/toggle buttons
        // Only flag buttons that explicitly control disclosure (have aria-controls or aria-haspopup)
        const hasDisclosureIndicator =
          hasAttribute(node.attributes, "aria-controls") ||
          hasAttribute(node.attributes, "aria-haspopup") ||
          hasAttribute(node.attributes, "data-disclosure");

        if (hasDisclosureIndicator) {
          const toggleProps = ["onClick", "onToggle", "onOpen", "onClose"];
          const isToggle = node.attributes.some((attr) => {
            if (attr.type !== "JSXAttribute") return false;
            const attrName = attr.name.name;
            return (
              toggleProps.includes(attrName) ||
              attrName.startsWith("onToggle") ||
              attrName.startsWith("onOpen") ||
              attrName.startsWith("onClose")
            );
          });

          if (
            isToggle &&
            (tagName === "button" ||
              tagName === "Button" ||
              tagName === "ActionIcon")
          ) {
            if (!hasAttribute(node.attributes, "aria-expanded")) {
              context.report({
                node,
                messageId: "requireAriaExpanded",
              });
            }
          }
        }
      },
    };
  },
};

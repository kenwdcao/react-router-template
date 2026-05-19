/**
 * @fileoverview ESLint rule to enforce lucide-react as the only icon library.
 * Forbids imports from other icon libraries.
 */

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce lucide-react as the only icon library",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
    messages: {
      preferLucideIcons:
        "{{library}} is not allowed. Use lucide-react as the only icon library.",
    },
  },
  create(context) {
    const forbiddenLibraries = [
      "react-icons",
      "@heroicons/react",
      "@heroicons/vue",
      "feather-icons",
      "@mdi/react",
      "@mdi/js",
      "@tabler/icons-react",
      "@tabler/icons",
      "ionicons",
      "@ant-design/icons",
      "@mui/icons-material",
      "@radix-ui/react-icons",
      "phosphor-react",
      "@phosphor-icons/react",
      "bootstrap-icons",
      "@fortawesome/react-fontawesome",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-regular-svg-icons",
      "@fortawesome/free-brands-svg-icons",
    ];

    const forbiddenPattern = new RegExp(
      `^(${forbiddenLibraries.map((lib) => lib.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    );

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        const match = source.match(forbiddenPattern);

        if (match) {
          context.report({
            node,
            messageId: "preferLucideIcons",
            data: { library: match[1] || match[0] },
          });
        }
      },
    };
  },
};

import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import localRules from "./eslint-rules/index.js";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      "local-rules": localRules,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // Local rules
      "local-rules/no-inline-styles": "error",
      "local-rules/no-browser-alerts": "error",
      "local-rules/prefer-lucide-icons": "error",
      "local-rules/require-aria-label": "warn",

      // Import restrictions: forbid non-lucide icon libraries
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "react-icons", message: "Use lucide-react instead." },
            { name: "react-icons/fa", message: "Use lucide-react instead." },
            { name: "react-icons/md", message: "Use lucide-react instead." },
            { name: "@heroicons/react", message: "Use lucide-react instead." },
            { name: "@heroicons/vue", message: "Use lucide-react instead." },
            { name: "feather-icons", message: "Use lucide-react instead." },
            { name: "@mdi/react", message: "Use lucide-react instead." },
            { name: "@mdi/js", message: "Use lucide-react instead." },
            {
              name: "@tabler/icons-react",
              message: "Use lucide-react instead.",
            },
            { name: "@tabler/icons", message: "Use lucide-react instead." },
            { name: "ionicons", message: "Use lucide-react instead." },
            { name: "@ant-design/icons", message: "Use lucide-react instead." },
            {
              name: "@mui/icons-material",
              message: "Use lucide-react instead.",
            },
            {
              name: "@radix-ui/react-icons",
              message: "Use lucide-react instead.",
            },
            { name: "phosphor-react", message: "Use lucide-react instead." },
            {
              name: "@phosphor-icons/react",
              message: "Use lucide-react instead.",
            },
            { name: "bootstrap-icons", message: "Use lucide-react instead." },
            {
              name: "@fortawesome/react-fontawesome",
              message: "Use lucide-react instead.",
            },
            {
              name: "@fortawesome/free-solid-svg-icons",
              message: "Use lucide-react instead.",
            },
            {
              name: "@fortawesome/free-regular-svg-icons",
              message: "Use lucide-react instead.",
            },
            {
              name: "@fortawesome/free-brands-svg-icons",
              message: "Use lucide-react instead.",
            },
          ],
          patterns: [
            {
              group: ["react-icons/*", "@heroicons/**", "@tabler/**"],
              message: "Use lucide-react as the only icon library.",
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      "build/**",
      "node_modules/**",
      ".react-router/**",
      "app/lib/db/database-types.ts",
    ],
  },
  prettierConfig,
);

import eslint from "@eslint/js";
import vitestPlugin from "@vitest/eslint-plugin";
import prettierConfig from "eslint-config-prettier";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import tailwindCanonicalClasses from "eslint-plugin-tailwind-canonical-classes";
import tseslint from "typescript-eslint";
import localRules from "./eslint-rules/index.js";

const typescriptFiles = ["**/*.{ts,tsx}"];

const iconImportRestrictions = {
  paths: [
    { name: "react-icons", message: "Use lucide-react instead." },
    { name: "react-icons/fa", message: "Use lucide-react instead." },
    { name: "react-icons/md", message: "Use lucide-react instead." },
    { name: "@heroicons/react", message: "Use lucide-react instead." },
    { name: "@heroicons/vue", message: "Use lucide-react instead." },
    { name: "feather-icons", message: "Use lucide-react instead." },
    { name: "@mdi/react", message: "Use lucide-react instead." },
    { name: "@mdi/js", message: "Use lucide-react instead." },
    { name: "@tabler/icons-react", message: "Use lucide-react instead." },
    { name: "@tabler/icons", message: "Use lucide-react instead." },
    { name: "ionicons", message: "Use lucide-react instead." },
    { name: "@ant-design/icons", message: "Use lucide-react instead." },
    { name: "@mui/icons-material", message: "Use lucide-react instead." },
    { name: "@radix-ui/react-icons", message: "Use lucide-react instead." },
    { name: "phosphor-react", message: "Use lucide-react instead." },
    { name: "@phosphor-icons/react", message: "Use lucide-react instead." },
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
};

const serverImportRestrictions = {
  patterns: [
    {
      group: ["**/*.server", "**/*.server/*"],
      allowTypeImports: true,
      message: "Do not import server-only modules into client-side code.",
    },
    {
      group: ["~/lib/db/server", "~/lib/db/server/*"],
      allowTypeImports: true,
      message: "Do not import database server modules into client-side code.",
    },
  ],
};

export default tseslint.config(
  {
    ignores: [
      "build/**",
      "node_modules/**",
      ".react-router/**",
      "app/generated/**",
      "app/lib/db/database-types.ts",
      "coverage/**",
      "test-results/**",
      "playwright-report/**",
      "**/*.{js,mjs,cjs}",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: typescriptFiles,
  })),
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: typescriptFiles,
  })),
  {
    files: typescriptFiles,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      "react-refresh": reactRefreshPlugin,
      "tailwind-canonical-classes": tailwindCanonicalClasses,
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
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/await-thenable": "error",
      "react/jsx-no-leaked-render": [
        "error",
        { validStrategies: ["ternary", "coerce"] },
      ],
      "react/no-unstable-nested-components": ["error", { allowAsProps: true }],
      "react/jsx-no-constructed-context-values": "error",
      eqeqeq: ["error", "always"],
      "no-implicit-coercion": "error",
      "tailwind-canonical-classes/tailwind-canonical-classes": [
        "warn",
        { cssPath: "./app/app.css" },
      ],

      // Local rules
      "local-rules/no-inline-styles": "error",
      "local-rules/no-browser-alerts": "error",
      "local-rules/require-aria-label": "error",

      // Import restrictions: forbid non-lucide icon libraries
      "no-restricted-imports": ["error", iconImportRestrictions],
    },
  },
  {
    files: ["**/*.server.ts", "app/routes/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/only-throw-error": [
        "error",
        {
          allow: [
            { from: "lib", name: "Response" },
            {
              from: "package",
              name: "DataWithResponseInit",
              package: "react-router",
            },
          ],
        },
      ],
    },
  },
  {
    // Client-side modules only. Route files are excluded because loaders/actions
    // legitimately import server modules at module scope; React Router handles
    // the client/server split during the build.
    files: ["app/ui/**/*.{ts,tsx}", "app/lib/**/*.{ts,tsx}"],
    ignores: [
      "**/*.server.ts",
      "**/*.server.test.ts",
      "**/__tests__/**",
      "app/lib/**/server.ts",
    ],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        serverImportRestrictions,
      ],
    },
  },
  {
    files: ["app/ui/**/*.{ts,tsx}", "app/lib/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["app/routes/**/*.{ts,tsx}", "app/root.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    files: ["app/lib/**/*.ts"],
    rules: {
      "local-rules/max-file-lines": ["error", { max: 500 }],
    },
  },
  {
    files: ["**/*.{test,spec}.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}"],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
    },
  },
  prettierConfig,
);

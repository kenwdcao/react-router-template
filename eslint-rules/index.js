/**
 * @fileoverview Local ESLint plugin for project-specific rules.
 */

import noInlineStyles from "./no-inline-styles.js";

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
  rules: {
    "no-inline-styles": noInlineStyles,
  },
};

export default plugin;

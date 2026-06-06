/**
 * @fileoverview Local ESLint plugin for project-specific rules.
 */

import maxFileLines from "./max-file-lines.js";
import noBrowserAlerts from "./no-browser-alerts.js";
import noInlineStyles from "./no-inline-styles.js";
import requireAriaLabel from "./require-aria-label.js";

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
  rules: {
    "max-file-lines": maxFileLines,
    "no-inline-styles": noInlineStyles,
    "no-browser-alerts": noBrowserAlerts,
    "require-aria-label": requireAriaLabel,
  },
};

export default plugin;

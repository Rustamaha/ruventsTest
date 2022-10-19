/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
  },
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
};

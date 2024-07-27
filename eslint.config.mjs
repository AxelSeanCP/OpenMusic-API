import globals from "globals";
import pluginJs from "@eslint/js";
import daStyle from "eslint-config-dicodingacademy";

export default [
  daStyle,
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    rules: {
      "linebreak-style": "off",
      quotes: "off",
      "no-undef": "off",
      camelcase: "off",
    },
  },
];

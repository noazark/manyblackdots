import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import {
  configureVueProject,
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import prettierConfig from "@vue/eslint-config-prettier";
import globals from "globals";

// Components use plain JS <script> blocks, so allow both langs.
configureVueProject({ scriptLangs: ["ts", "js"] });

export default defineConfigWithVueTs(
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  pluginVue.configs["flat/essential"],
  js.configs.recommended,
  vueTsConfigs.recommended,
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "vue/multi-word-component-names": "off",
    },
  },
  {
    // Vitest runs with `globals: true`.
    files: ["tests/**"],
    languageOptions: {
      globals: globals.vitest,
    },
  },
);

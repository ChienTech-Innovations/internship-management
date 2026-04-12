import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  // ✅ ignore build + deps
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "build/**"]
  },

  // base JS
  js.configs.recommended,

  // TS
  ...tseslint.configs.recommended,

  {
    // ✅ set environment (fix window, document, fetch...)
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        URL: "readonly",
        location: "readonly"
      }
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y
    },

    rules: {
      // React 19
      "react/react-in-jsx-scope": "off",

      // Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // TS
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",

      // optional: giảm noise
      "@typescript-eslint/no-empty-object-type": "off",
      "no-empty": "warn"
    },

    settings: {
      react: {
        version: "detect"
      }
    }
  }
];

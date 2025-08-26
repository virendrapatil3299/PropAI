import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

// Use FlatCompat to re-use the legacy-style configs like next/core-web-vitals
export default [
  // Expand these as needed
  ...compat.extends("next/core-web-vitals", "plugin:react/recommended", "plugin:@typescript-eslint/recommended"),

  // Example override for TS/TSX files (add parser config if you use TypeScript)
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    // Add any custom rules you want here
    rules: {},
  },
];

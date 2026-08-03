import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import jsxA11y from "eslint-plugin-jsx-a11y";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Accessibility linting that understands JSX expressions, unlike the
  // HTML-oriented webhint editor extension. Only the rules are spread here:
  // next/core-web-vitals already registers the jsx-a11y plugin itself.
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: jsxA11y.flatConfigs.strict.rules,
  },
];

export default eslintConfig;

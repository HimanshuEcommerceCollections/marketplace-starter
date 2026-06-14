import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "scripts/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // Token-only theming enforcement (see CLAUDE.md). Literal colors/inline
      // styles are forbidden outside src/styles + brands/*/theme.css.
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[name.name='style']",
          message:
            "Inline style is banned. Use token-backed Tailwind utilities (bg-*, text-*, p-*, rounded-*).",
        },
        {
          selector:
            "Literal[value=/#(?:[0-9a-fA-F]{3,8})\\b|\\b(?:rgb|rgba|hsl|hsla)\\(/]",
          message:
            "Hardcoded color literal. Add a token in src/styles/tokens.css (or a brand theme.css) and use the utility.",
        },
      ],
    },
  },
  {
    // Vendored shadcn/ui primitives may use inline transforms (e.g. Progress).
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
];

export default eslintConfig;

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Source retained from public routes removed by the canonical site renderer.
    "src/components/*.tsx",
    "src/components/about/**",
    "src/components/blog/**",
    "src/components/creative/**",
    "src/components/focused/**",
    "src/components/home/**",
    "src/components/immersive/**",
    "src/components/services/**",
    "src/components/three/**",
    "src/components/ui/**",
    "src/app/_legacy/**",
  ]),
]);

export default eslintConfig;

import js from '@eslint/js'
import astro from 'eslint-plugin-astro'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['dist', 'docs', '.astro'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...astro.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.astro'],
      },
    },
  },
  // Plain JS config files aren't part of the type-checked project graph.
  {
    files: ['**/*.{js,mjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
  // Type-aware rules need a real tsc program: `astro-eslint-parser` falls back to
  // `project: true` (it doesn't support `projectService`) and plain tsc can't resolve
  // `.astro` imports at all (only Astro's language server can), so template expressions
  // type-check as `error`. Keep `.astro` files on the non-type-checked rules instead.
  {
    files: ['**/*.astro'],
    ...tseslint.configs.disableTypeChecked,
  },
  // Source code gets browser globals. Build-time code still runs under Node, but
  // eslint-plugin-astro gives `.astro` frontmatter Node globals and `no-undef` is off for `.ts`.
  {
    files: ['src/**/*.{ts,astro}'],
    ignores: ['src/test/**', '**/*.test.ts'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  // Config files, e2e specs and tests run under Node instead.
  {
    files: ['*.{js,mjs,ts}', 'e2e/**/*.ts', 'src/test/**/*.ts', 'src/**/*.test.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
]

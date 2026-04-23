// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="../vendor/integration/types.d.ts" />

// Ambient declaration for YAML imports.
// Astro 6 + Vite resolve *.yaml via the @astrojs/yaml2js plugin at build time.
// TypeScript does not know about this transform, so we declare the module shape here.
// The actual type is 'any' to avoid maintaining a per-file interface; callers narrow as needed.
declare module '*.yaml' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any;
  export default value;
}

/// <reference types="vite/client" />

// Vanta ships untyped UMD builds; each effect's default export is a factory taking { el, THREE, ...options }.
declare module 'vanta/dist/*' {
  const effect: (options: Record<string, unknown>) => { destroy: () => void };
  export default effect;
}
// three.js 0.134 (pinned for Vanta) ships no types; it is only passed through to Vanta.
declare module 'three';

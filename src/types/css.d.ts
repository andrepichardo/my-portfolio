// `import "./globals.css"` in the root layout has no type declaration behind it:
// the only stylesheet module Next declares (node_modules/next/types/global.d.ts)
// is `*.module.css`. Recent TypeScript versions check that side-effect imports
// resolve to something, so an editor running a newer compiler than the pinned
// one flags the line while `tsc --noEmit` and `next build` both stay quiet.
//
// A stylesheet import is handled by the bundler, not the type system, so there is
// nothing to describe here beyond "this resolves".
declare module '*.css';

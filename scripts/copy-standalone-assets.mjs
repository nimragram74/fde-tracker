// Completes the Next.js standalone bundle for deployment.
//
// `next build` (output: "standalone") emits .next/standalone/server.js plus a
// traced node_modules, but it does NOT copy public/ or .next/static, and output
// tracing frequently misses Prisma's query engine. This script copies those in
// so `node .next/standalone/server.js` runs fully self-contained on App Service.
//
// Cross-platform (uses Node fs), idempotent, safe to run after every build.
import { existsSync, cpSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");

if (!existsSync(standalone)) {
  console.error(
    `[copy-standalone-assets] ${standalone} not found — did 'next build' run with output:'standalone'?`,
  );
  process.exit(1);
}

/** Copy src → dest recursively if src exists. */
function copy(src, dest, label) {
  const from = join(root, src);
  if (!existsSync(from)) {
    console.warn(`[copy-standalone-assets] skip ${label}: ${from} missing`);
    return;
  }
  mkdirSync(join(dest, ".."), { recursive: true });
  cpSync(from, dest, { recursive: true });
  console.log(`[copy-standalone-assets] copied ${label}`);
}

copy("public", join(standalone, "public"), "public/");
copy(".next/static", join(standalone, ".next", "static"), ".next/static");
copy(
  "node_modules/.prisma",
  join(standalone, "node_modules", ".prisma"),
  "prisma engine (.prisma)",
);
copy(
  "node_modules/@prisma",
  join(standalone, "node_modules", "@prisma"),
  "@prisma",
);

console.log("[copy-standalone-assets] standalone bundle complete");

#!/usr/bin/env tsx
/**
 * scripts/check-translation-parity.ts
 *
 * Build-time translation parity check.
 * Scans long-form content collection directories to ensure every DE entry
 * has a matching EN entry (and vice versa) by comparing translationKey values.
 *
 * Per I18N-08 / D-15 / D-16:
 * - Runs before `astro build` in the pnpm build pipeline
 * - Exits non-zero on parity violation, failing the CI build
 * - Short-form collections (event, team) are excluded — always bilingual by structure
 * - Empty or missing directories are silently skipped (valid during Phase 3)
 */

import * as fs from 'fs';
import * as path from 'path';

// Long-form collections that require DE+EN parity checking (I18N-06)
const LONG_FORM_COLLECTIONS = ['post', 'caseStudy', 'useCase', 'industry', 'job'] as const;

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

/**
 * Extract the translationKey from a markdown file's YAML frontmatter.
 * Falls back to the filename stem if translationKey is not declared.
 * This prevents build failures from files that rely on the filename fallback convention.
 */
function extractTranslationKey(filePath: string): string {
  const filename = path.basename(filePath, path.extname(filePath));
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Match YAML frontmatter block: --- ... ---
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (fmMatch) {
      const fm = fmMatch[1];
      // Extract translationKey value (supports quoted and unquoted)
      const keyMatch = fm.match(/^translationKey:\s*['"]?([^\r\n'"]+)['"]?\s*$/m);
      if (keyMatch) {
        return keyMatch[1].trim();
      }
    }
  } catch {
    // File read error — fall back to filename stem
  }
  return filename;
}

/**
 * Collect all translationKey values from .md and .mdx files in a directory.
 * Returns a Map of translationKey → filename for error reporting.
 */
function collectKeys(dir: string): Map<string, string> {
  const keys = new Map<string, string>();
  if (!fs.existsSync(dir)) return keys;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const key = extractTranslationKey(filePath);
    keys.set(key, file);
  }
  return keys;
}

async function checkTranslationParity(): Promise<void> {
  let hasErrors = false;
  let checkedCollections = 0;

  for (const collection of LONG_FORM_COLLECTIONS) {
    const collectionPath = path.join(CONTENT_DIR, collection);
    const deDir = path.join(collectionPath, 'de');
    const enDir = path.join(collectionPath, 'en');

    // Skip collections whose directories don't exist yet (valid during Phase 3)
    if (!fs.existsSync(deDir) && !fs.existsSync(enDir)) continue;

    const deKeys = collectKeys(deDir);
    const enKeys = collectKeys(enDir);

    // Skip empty collections (no files in either directory)
    if (deKeys.size === 0 && enKeys.size === 0) continue;

    checkedCollections++;

    // Check: every DE entry must have an EN counterpart
    for (const [key, file] of deKeys) {
      if (!enKeys.has(key)) {
        console.error(
          `[parity] ERROR in '${collection}': DE entry "${file}" (translationKey: "${key}") has no EN sibling`
        );
        hasErrors = true;
      }
    }

    // Check: every EN entry must have a DE counterpart
    for (const [key, file] of enKeys) {
      if (!deKeys.has(key)) {
        console.error(
          `[parity] ERROR in '${collection}': EN entry "${file}" (translationKey: "${key}") has no DE sibling`
        );
        hasErrors = true;
      }
    }
  }

  if (hasErrors) {
    console.error('\n[parity] Build blocked: fix missing translation siblings before building.');
    process.exit(1);
  }

  if (checkedCollections === 0) {
    console.log('[parity] No content entries found — skipping parity check (Phase 3 empty state).');
  } else {
    console.log(`[parity] OK — all ${checkedCollections} collection(s) with content are bilingual.`);
  }
}

checkTranslationParity().catch((err: unknown) => {
  console.error('[parity] Unexpected error:', err);
  process.exit(1);
});

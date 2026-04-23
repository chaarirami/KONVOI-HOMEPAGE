#!/usr/bin/env tsx
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

function parseFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const yaml = match[1];
  const result: Record<string, unknown> = {};
  let lastKey: string | null = null;

  for (const rawLine of yaml.split(/\r?\n/)) {
    const arrayItemMatch = rawLine.match(/^\s{2}-\s+(.+)$/);
    if (arrayItemMatch && lastKey !== null && Array.isArray(result[lastKey])) {
      (result[lastKey] as string[]).push(
        arrayItemMatch[1].trim().replace(/^['"]|['"]$/g, '')
      );
      continue;
    }

    const kvMatch = rawLine.match(/^([\w][\w-]*):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      const trimmed = value.trim();
      lastKey = key;
      if (trimmed === '' || trimmed === '|' || trimmed === '>') {
        result[key] = [];
      } else {
        result[key] = trimmed.replace(/^['"]|['"]$/g, '');
      }
    }
  }

  return result;
}

function getMdFiles(dir: string): string[] {
  try {
    const entries = readdirSync(dir, { recursive: true, encoding: 'utf-8' });
    return (entries as string[]).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }
}

function readFrontmatters(baseDir: string): Array<Record<string, unknown>> {
  const files = getMdFiles(baseDir);
  return files.map((file) => {
    const fullPath = join(baseDir, file);
    const content = readFileSync(fullPath, 'utf-8');
    return { _file: file, ...parseFrontmatter(content) };
  });
}

const ROOT = process.cwd();
const useCaseDir = join(ROOT, 'src/content/useCase');
const industryDir = join(ROOT, 'src/content/industry');

const useCases = readFrontmatters(useCaseDir);
const industries = readFrontmatters(industryDir);

const industrySlugSet = new Set<string>(
  industries
    .map((e) => e['slug'])
    .filter((s): s is string => typeof s === 'string')
);

const useCaseCanonicalKeySet = new Set<string>(
  useCases
    .map((e) => e['canonicalKey'])
    .filter((s): s is string => typeof s === 'string')
);

const errors: string[] = [];

for (const uc of useCases) {
  const related = uc['relatedIndustries'];
  if (!Array.isArray(related) || related.length === 0) continue;
  for (const slug of related as string[]) {
    if (!industrySlugSet.has(slug)) {
      errors.push(
        `[useCase/${String(uc['_file'])}] relatedIndustries contains unknown industry slug: "${slug}"\n` +
          `  Known slugs: ${[...industrySlugSet].sort().join(', ')}`
      );
    }
  }
}

for (const ind of industries) {
  const related = ind['relatedUseCases'];
  if (!Array.isArray(related) || related.length === 0) continue;
  for (const key of related as string[]) {
    if (!useCaseCanonicalKeySet.has(key)) {
      errors.push(
        `[industry/${String(ind['_file'])}] relatedUseCases contains unknown useCase canonicalKey: "${key}"\n` +
          `  Known keys: ${[...useCaseCanonicalKeySet].sort().join(', ')}`
      );
    }
  }
}

if (errors.length > 0) {
  console.error('\nCross-link validation FAILED:\n');
  for (const err of errors) {
    console.error(`  - ${err}\n`);
  }
  console.error(
    `${errors.length} error(s) found. Fix the above cross-links before building.\n`
  );
  process.exit(1);
} else {
  const ucCount = useCases.length;
  const indCount = industries.length;
  console.log(
    `Cross-link validation passed -- ${ucCount} use cases x ${indCount} industries, no broken links.`
  );
}

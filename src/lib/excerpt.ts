// src/lib/excerpt.ts
//
// Derive a short excerpt from a markdown post body, suitable for showing
// under the title in list views. Sentence-aware truncation: prefers cutting
// at a sentence terminator near the soft limit; only hard-cuts when none
// is found within the hard limit.

const SOFT_LIMIT = 80;
const HARD_LIMIT = 100;
const TERMINATORS = ['。', '．', '.', '！', '？', '!', '?'];
const ELLIPSIS = '⋯';

/**
 * Strip markdown / HTML noise from raw body and return the first non-empty
 * paragraph as a single line of plain text.
 */
function cleanFirstParagraph(body: string): string {
  // Remove fenced code blocks first (they would otherwise contribute text).
  let s = body.replace(/```[\s\S]*?```/g, '');

  // Split into paragraphs (blank-line delimited) and accumulate cleaned
  // paragraphs until we have at least SOFT_LIMIT characters. This avoids
  // returning a too-short opening line (e.g. a one-line dialogue) when
  // following paragraphs would yield a more informative excerpt.
  const paragraphs = s.split(/\n\s*\n/);
  const collected: string[] = [];
  let total = 0;
  for (const raw of paragraphs) {
    const cleaned = cleanLine(raw);
    if (!cleaned) continue;
    collected.push(cleaned);
    total += cleaned.length;
    if (total >= SOFT_LIMIT) break;
  }
  return collected.join(' ');
}

function cleanLine(raw: string): string {
  // Skip headings (entire paragraph is a heading line)
  if (/^\s*#/.test(raw)) return '';

  let s = raw;
  // Obsidian wiki image: ![[...]]
  s = s.replace(/!\[\[[^\]]*\]\]/g, '');
  // Markdown image: ![alt](url)
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  // Inline link [text](url) → text
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  // HTML tags
  s = s.replace(/<[^>]+>/g, '');
  // Collapse whitespace (incl. newlines inside the paragraph) and trim
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function isTerminator(ch: string): boolean {
  return TERMINATORS.includes(ch);
}

/**
 * Find the index *after* the last terminator within [0, limit). Returns -1
 * if no terminator exists in that range.
 */
function lastTerminatorEnd(text: string, limit: number): number {
  const end = Math.min(limit, text.length);
  for (let i = end - 1; i >= 0; i--) {
    if (isTerminator(text[i]!)) return i + 1;
  }
  return -1;
}

/**
 * Find the index *after* the first terminator in [start, limit). Returns -1
 * if no terminator exists in that range.
 */
function firstTerminatorEnd(text: string, start: number, limit: number): number {
  const end = Math.min(limit, text.length);
  for (let i = start; i < end; i++) {
    if (isTerminator(text[i]!)) return i + 1;
  }
  return -1;
}

function truncate(text: string): string {
  if (text.length <= SOFT_LIMIT) return text;

  const softCut = lastTerminatorEnd(text, SOFT_LIMIT);
  if (softCut > 0) return text.slice(0, softCut);

  const hardCut = firstTerminatorEnd(text, SOFT_LIMIT, HARD_LIMIT);
  if (hardCut > 0) return text.slice(0, hardCut);

  return text.slice(0, SOFT_LIMIT) + ELLIPSIS;
}

export function extractExcerpt(body: string, description?: string): string {
  if (description && description.trim()) {
    return truncate(description.trim());
  }
  const para = cleanFirstParagraph(body);
  if (!para) return '';
  return truncate(para);
}

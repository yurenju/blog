// Mock for astro:content — used in vitest only.
// The helpers under test (inferLocaleFromFilename, computeAvailableLocales)
// do not call getCollection, so an empty stub is sufficient.
export type CollectionEntry<_T extends string> = {
  id: string;
  filePath?: string;
  data: Record<string, unknown>;
  body?: string;
};

export async function getCollection(_name: string): Promise<CollectionEntry<string>[]> {
  return [];
}

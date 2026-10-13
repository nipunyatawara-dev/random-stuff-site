import type { Item } from "@/data/items";
import { itemMatchesPlatformTag } from "@/lib/platform-tags";
import { SEARCH_TOPICS, type SearchTopic } from "@/lib/search-topics";

type SearchOptions = {
  platformTag?: string;
  browseCategory?: string;
};

type IndexedItem = {
  item: Item;
  title: string;
  description: string;
  category: string;
  tags: string[];
  searchTerms: string[];
  titleTokens: string[];
  descriptionTokens: string[];
  searchTermTokens: string[];
};

type QueryConcept =
  | { kind: "topic"; topic: SearchTopic; source: string }
  | { kind: "text"; term: string };

const STOP_WORDS = new Set([
  "a", "an", "and", "app", "apps", "application", "applications", "for", "me", "of",
  "find", "need", "or", "please", "related", "show", "something", "stuff", "that", "the",
  "thing", "things", "tool", "tools", "to", "use", "uses", "using", "want", "with",
]);

const indexCache = new WeakMap<readonly Item[], IndexedItem[]>();
const itemIndexCache = new WeakMap<Item, IndexedItem>();

export function normalizeSearchText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9+#.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string) {
  return normalizeSearchText(value).split(" ").filter(Boolean);
}

function getIndex(items: readonly Item[]) {
  const cached = indexCache.get(items);
  if (cached) return cached;

  const index = items.map((item): IndexedItem => {
    const cachedItem = itemIndexCache.get(item);
    if (cachedItem) return cachedItem;

    const title = normalizeSearchText(item.title);
    const description = normalizeSearchText(item.description);
    const searchTerms = (item.searchTerms ?? []).map(normalizeSearchText);

    const indexed = {
      item,
      title,
      description,
      category: normalizeSearchText(item.category),
      tags: item.tags.map(normalizeSearchText),
      searchTerms,
      titleTokens: tokenize(title),
      descriptionTokens: tokenize(description),
      searchTermTokens: searchTerms.flatMap(tokenize),
    };
    itemIndexCache.set(item, indexed);
    return indexed;
  });

  indexCache.set(items, index);
  return index;
}

const aliasEntries = (Object.entries(SEARCH_TOPICS) as [SearchTopic, readonly string[]][])
  .flatMap(([topic, aliases]) => aliases.map((alias) => ({
    topic,
    alias: normalizeSearchText(alias),
    tokens: tokenize(alias),
  })))
  .sort((a, b) => b.tokens.length - a.tokens.length || b.alias.length - a.alias.length);

const singleTokenAliases = aliasEntries.filter((entry) => entry.tokens.length === 1);
const multiTokenAliases = aliasEntries.filter((entry) => entry.tokens.length > 1);
const normalizedTopicAliases = Object.fromEntries(
  Object.entries(SEARCH_TOPICS).map(([topic, aliases]) => [topic, aliases.map(normalizeSearchText)]),
) as Record<SearchTopic, string[]>;

function editDistance(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    for (let j = 0; j <= b.length; j += 1) previous[j] = current[j];
  }

  return previous[b.length];
}

function allowedDistance(term: string) {
  if (term.length >= 8) return 2;
  if (term.length >= 4) return 1;
  return 0;
}

function resolveFuzzyTopic(term: string): SearchTopic | null {
  const threshold = allowedDistance(term);
  if (!threshold) return null;

  let bestDistance = threshold + 1;
  let bestTopics = new Set<SearchTopic>();

  for (const entry of singleTokenAliases) {
    if (Math.abs(entry.alias.length - term.length) > threshold) continue;
    const distance = editDistance(term, entry.alias);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestTopics = new Set([entry.topic]);
    } else if (distance === bestDistance) {
      bestTopics.add(entry.topic);
    }
  }

  return bestDistance <= threshold && bestTopics.size === 1 ? [...bestTopics][0] : null;
}

function parseQuery(query: string): QueryConcept[] {
  const tokens = tokenize(query).filter((token) => !STOP_WORDS.has(token));
  const consumed = new Set<number>();
  const concepts: QueryConcept[] = [];

  for (const entry of multiTokenAliases) {
    for (let start = 0; start <= tokens.length - entry.tokens.length; start += 1) {
      const indexes = entry.tokens.map((_, offset) => start + offset);
      if (indexes.some((index) => consumed.has(index))) continue;
      if (!entry.tokens.every((token, offset) => tokens[start + offset] === token)) continue;

      indexes.forEach((index) => consumed.add(index));
      concepts.push({ kind: "topic", topic: entry.topic, source: entry.alias });
    }
  }

  tokens.forEach((term, index) => {
    if (consumed.has(index)) return;

    const exactTopics = new Set(
      singleTokenAliases.filter((entry) => entry.alias === term).map((entry) => entry.topic),
    );
    if (exactTopics.size === 1) {
      concepts.push({ kind: "topic", topic: [...exactTopics][0], source: term });
      return;
    }

    const fuzzyTopic = resolveFuzzyTopic(term);
    if (fuzzyTopic) {
      concepts.push({ kind: "topic", topic: fuzzyTopic, source: term });
      return;
    }

    concepts.push({ kind: "text", term });
  });

  const seen = new Set<string>();
  return concepts.filter((concept) => {
    const key = concept.kind === "topic" ? `topic:${concept.topic}` : `text:${concept.term}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function hasWord(text: string, term: string) {
  return (` ${text} `).includes(` ${term} `);
}

function hasTokenPrefix(tokens: string[], term: string) {
  return term.length >= 2 && tokens.some((token) => token.startsWith(term));
}

function fuzzyTokenMatch(tokens: string[], term: string) {
  const threshold = allowedDistance(term);
  if (!threshold) return false;
  return tokens.some((token) => (
    Math.abs(token.length - term.length) <= threshold && editDistance(token, term) <= threshold
  ));
}

function scoreTopic(indexed: IndexedItem, topic: SearchTopic, source: string) {
  if (!indexed.item.topics.includes(topic)) return null;

  const aliases = normalizedTopicAliases[topic];
  let score = 60;

  if (hasWord(indexed.title, source)) score += 55;
  else if (aliases.some((alias) => hasWord(indexed.title, alias))) score += 35;

  if (indexed.searchTerms.some((term) => term === source || aliases.includes(term))) score += 30;
  if (aliases.some((alias) => hasWord(indexed.description, alias))) score += 18;

  return score;
}

function scoreText(indexed: IndexedItem, term: string) {
  if (hasWord(indexed.title, term)) return 90;
  if (hasTokenPrefix(indexed.titleTokens, term)) return 72;
  if (indexed.searchTerms.some((value) => hasWord(value, term))) return 62;
  if (hasTokenPrefix(indexed.searchTermTokens, term)) return 56;
  if (hasWord(indexed.description, term)) return 42;
  if (hasTokenPrefix(indexed.descriptionTokens, term)) return 34;
  if (hasWord(indexed.category, term) || indexed.tags.some((tag) => hasWord(tag, term))) return 22;
  if (fuzzyTokenMatch(indexed.titleTokens, term)) return 25;
  if (fuzzyTokenMatch(indexed.searchTermTokens, term)) return 18;
  if (fuzzyTokenMatch(indexed.descriptionTokens, term)) return 12;
  return null;
}

function scoreItem(indexed: IndexedItem, concepts: QueryConcept[], normalizedQuery: string) {
  let score = indexed.title === normalizedQuery ? 250 : 0;

  for (const concept of concepts) {
    const conceptScore = concept.kind === "topic"
      ? scoreTopic(indexed, concept.topic, concept.source)
      : scoreText(indexed, concept.term);

    if (conceptScore === null) return null;
    score += conceptScore;
  }

  return score;
}

export function searchItems(
  items: readonly Item[],
  query: string,
  { platformTag = "all", browseCategory }: SearchOptions = {},
): Item[] {
  const normalizedQuery = normalizeSearchText(query);
  const isSearching = normalizedQuery.length > 0;
  const concepts = parseQuery(query);

  const candidates = getIndex(items).filter(({ item }) => {
    if (!isSearching && browseCategory && item.category !== browseCategory) return false;
    return itemMatchesPlatformTag(item, platformTag);
  });

  if (!isSearching || concepts.length === 0) {
    return candidates.map(({ item }) => item).sort((a, b) => a.title.localeCompare(b.title));
  }

  return candidates
    .map((indexed) => ({ indexed, score: scoreItem(indexed, concepts, normalizedQuery) }))
    .filter((result): result is { indexed: IndexedItem; score: number } => result.score !== null)
    .sort((a, b) => b.score - a.score || a.indexed.item.title.localeCompare(b.indexed.item.title))
    .map(({ indexed }) => indexed.item);
}

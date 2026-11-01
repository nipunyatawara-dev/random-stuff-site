"use client";
import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Search,
  X,
  Heart,
  SlidersHorizontal,
  Scale,
  Sparkles,
  Download,
  Upload,
  ArrowUpRight,
} from "lucide-react";
import type { Item } from "@/data/items";
import { CURATED_STACKS, type CuratedStack } from "@/data/stacks";
import { useFavorites } from "@/hooks/useFavorites";
import { readCatalogUrl } from "@/lib/catalog-url";
import { searchItems } from "@/lib/item-search";
import { itemMatchesPlatformTag } from "@/lib/platform-tags";
import { isRecentlyAdded } from "@/lib/catalog-dates";
import { copyText } from "@/lib/client-actions";
import DirectoryCard from "./DirectoryCard";
import ComparisonFacts from "./ComparisonFacts";
import Modal from "./Modal";
const CompareModal = dynamic(() => import("./CompareModal"));
const CommandPalette = dynamic(() => import("./CommandPalette"));
const Roulette = dynamic(() => import("./RandomRouletteModal"));
const categories = [
  ["all", "All tools"],
  ["Websites", "Websites"],
  ["Softwares", "Software"],
  ["Scripts", "Scripts"],
  ["stacks", "Stacks"],
  ["favorites", "Saved"],
];
const platforms = [
  ["all", "Any platform"],
  ["macos", "macOS"],
  ["windows", "Windows"],
  ["linux", "Linux"],
  ["web", "Web"],
];
const features = [
  ["cli", "CLI / terminal"],
  ["open-source", "Verified open source"],
  ["free", "Verified free"],
];
export interface ContentSectionProps {
  initialItems: Item[];
}
export default function ContentSection({
  initialItems: items,
}: ContentSectionProps) {
  const {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorites,
    removeFavorites,
  } = useFavorites();
  const [category, setCategory] = useState("all"),
    [tag, setTag] = useState("all"),
    [attributes, setAttributes] = useState<string[]>([]),
    [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const [stack, setStack] = useState<CuratedStack | null>(null),
    [preview, setPreview] = useState<Item | null>(null),
    [count, setCount] = useState(24),
    [ready, setReady] = useState(false);
  const [showFilters, setShowFilters] = useState(false),
    [showCompare, setShowCompare] = useState(false),
    [palette, setPalette] = useState(false),
    [roulette, setRoulette] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]),
    [selected, setSelected] = useState<string[]>([]),
    [selectionMode, setSelectionMode] = useState(false),
    [confirmRemove, setConfirmRemove] = useState(false);
  const [notice, setNotice] = useState(""),
    [fallbackLink, setFallbackLink] = useState(""),
    [offline, setOffline] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null),
    searchRef = useRef<HTMLInputElement>(null),
    historyMode = useRef<"push" | "replace">("replace");
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const id = setInterval(update, 3600000);
    return () => clearInterval(id);
  }, []);
  const transition = () => {
    historyMode.current = "push";
  };
  useEffect(() => {
    const restore = () => {
      const state = readCatalogUrl(new URL(location.href), items);
      setCategory(state.category);
      setTag(state.tag);
      setQuery(state.query);
      setStack(state.stack);
      setPreview(state.tool);
      setAttributes(
        (new URL(location.href).searchParams.get("features") || "")
          .split(",")
          .filter((v) => features.some(([id]) => id === v)),
      );
      historyMode.current = "replace";
      setReady(true);
    };
    restore();
    window.addEventListener("popstate", restore);
    window.addEventListener("hashchange", restore);
    return () => {
      window.removeEventListener("popstate", restore);
      window.removeEventListener("hashchange", restore);
    };
  }, [items]);
  useEffect(() => {
    if (!ready) return;
    const url = new URL(location.href);
    const set = (name: string, value: string) =>
      value ? url.searchParams.set(name, value) : url.searchParams.delete(name);
    set("q", query.trim());
    set("category", category === "all" ? "" : category);
    set("tag", tag === "all" ? "" : tag);
    set("features", attributes.join(","));
    set("stack", stack?.id || "");
    set("tool", preview?.id || "");
    const next = url.pathname + url.search + url.hash;
    if (next !== location.pathname + location.search + location.hash) {
      if (historyMode.current === "push")
        history.pushState(history.state, "", next);
      else history.replaceState(history.state, "", next);
    }
    historyMode.current = "replace";
  }, [ready, query, category, tag, attributes, stack, preview]);
  useEffect(() => {
    setCount(24);
    setSelected([]);
    setSelectionMode(false);
  }, [category, tag, deferred, attributes, stack]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    const status = () => setOffline(!navigator.onLine);
    const message = (e: Event) => setNotice((e as CustomEvent<string>).detail);
    status();
    window.addEventListener("keydown", key);
    window.addEventListener("online", status);
    window.addEventListener("offline", status);
    window.addEventListener("favorites-notice", message);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("online", status);
      window.removeEventListener("offline", status);
      window.removeEventListener("favorites-notice", message);
    };
  }, []);
  const chooseCategory = (value: string) => {
    transition();
    setCategory(value);
    setStack(null);
    setQuery("");
    setTag("all");
    setAttributes([]);
  };
  const clearFilters = () => {
    setQuery("");
    setTag("all");
    setAttributes([]);
  };
  const onPreview = useCallback((item: Item) => {
    historyMode.current = "push";
    setPreview(item);
    setFallbackLink("");
  }, []);
  const toggleCompare = (item: Item) => {
    setCompareIds((ids) => {
      if (ids.includes(item.id)) return ids.filter((id) => id !== item.id);
      if (ids.length === 3) {
        setNotice("Compare up to three tools. Remove one to add another.");
        return ids;
      }
      return [...ids, item.id];
    });
  };
  const candidates = useMemo(
    () =>
      items.filter(
        (item) =>
          (category === "favorites"
            ? favorites.includes(item.id)
            : category === "stacks"
              ? Boolean(stack?.itemIds.includes(item.id))
              : category === "all" || item.category === category) &&
          itemMatchesPlatformTag(item, tag) &&
          attributes.every((attr) => itemMatchesPlatformTag(item, attr)),
      ),
    [items, category, favorites, stack, tag, attributes],
  );
  const results = useMemo(
    () => (deferred.trim() ? searchItems(candidates, deferred) : candidates),
    [candidates, deferred],
  );
  const overview = category === "stacks" && !stack;
  const shownStacks = CURATED_STACKS.filter(
    (s) =>
      !deferred.trim() ||
      `${s.title} ${s.description}`
        .toLowerCase()
        .includes(deferred.toLowerCase()),
  );
  const activeFilters =
    (tag === "all" ? 0 : 1) + attributes.length + (query.trim() ? 1 : 0);
  const save = (id: string) => {
    const wasSaved = isFavorite(id);
    toggleFavorite(id);
    const title = items.find((i) => i.id === id)?.title;
    setNotice(
      `${title} ${wasSaved ? "removed from" : "saved to"} this browser's favorites.`,
    );
  };
  const copy = async (value: string) => {
    if (await copyText(value)) {
      setNotice("Link copied.");
      setFallbackLink("");
    } else {
      setFallbackLink(value);
      setNotice("Copy was unavailable. Select and copy the link below.");
    }
  };
  const exportFile = async (format: "txt" | "md" | "json" | "html") => {
    const lib = await import("@/lib/export-favorites");
    const saved = items.filter((i) => favorites.includes(i.id));
    if (!saved.length) {
      setNotice("Save a tool before exporting. You can import a backup now.");
      return;
    }
    const content =
      format === "txt"
        ? lib.exportFavoritesText(saved)
        : format === "md"
        ? lib.exportFavoritesMarkdown(saved)
        : format === "json"
          ? lib.exportFavoritesJson(saved)
          : lib.exportFavoritesHtml(saved);
    lib.triggerFileDownload(
      `random-stuff-favorites.${format}`,
      content,
      format === "txt"
        ? "text/plain;charset=utf-8"
        : format === "json"
        ? "application/json"
        : format === "html"
          ? "text/html"
          : "text/markdown",
    );
    setNotice("Export downloaded.");
  };
  const importFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 1_000_000)
        throw new Error("Choose a JSON backup smaller than 1 MB.");
      const { parseFavoritesImport } = await import("@/lib/export-favorites");
      const result = parseFavoritesImport(await file.text());
      const newIds = result.ids.filter((id) => !favorites.includes(id));
      addFavorites(newIds);
      setNotice(
        `${newIds.length} imported, ${result.ids.length - newIds.length} already saved, ${result.unknownCount} unknown, ${result.duplicateCount} duplicate IDs ignored.`,
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not import this backup.",
      );
    }
    e.target.value = "";
  };
  return (
    <section
      id="catalog-section"
      className="catalog"
      aria-labelledby="catalog-title"
    >
      {offline && (
        <p className="notice" role="status">
          You are offline. Saved pages and the catalog remain available;
          external tools and suggestions need a connection.
        </p>
      )}
      <h2 id="catalog-title" className="sr-only">
        Find your next useful tool
      </h2>
      <div className="search-row">
        <div className="catalog-search">
          <Search aria-hidden="true" size={22} />
          <label htmlFor="catalog-search" className="sr-only">
            {overview
              ? "Search curated stacks"
              : "Search tools by name, task or tag"}
          </label>
          <input
            id="catalog-search"
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder={
              overview
                ? "Find a stack…"
                : `Search ${items.length} tools, or a task…`
            }
            autoComplete="off"
            maxLength={200}
          />
          {query ? (
            <button
              className="icon-button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              <X size={20} />
            </button>
          ) : (
            <button
              className="search-shortcut"
              onClick={() => setPalette(true)}
              aria-label="Open command palette"
            >
              Ctrl / ⌘ K
            </button>
          )}
        </div>
        {!overview && (
          <button
            className="button filter-toggle"
            aria-expanded={showFilters}
            aria-controls="catalog-filters"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal size={18} />
            Filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
          </button>
        )}
      </div>
      <div
        className="catalog-navigation"
        role="group"
        aria-label="Browse collection"
      >
        {categories.map(([id, label]) => (
          <button
            key={id}
            aria-pressed={category === id}
            onClick={() => chooseCategory(id)}
          >
            {label}
            {id === "favorites" && favorites.length > 0 && (
              <span>{favorites.length}</span>
            )}
          </button>
        ))}
      </div>
      {!overview && (
        <div
          id="catalog-filters"
          className={`catalog-filters ${showFilters ? "filters-open" : ""}`}
        >
          <div>
            <label htmlFor="platform-filter">Platform</label>
            <select
              id="platform-filter"
              value={tag}
              onChange={(e) => {
                transition();
                setTag(e.target.value);
              }}
            >
              {platforms.map(([id, label]) => (
                <option value={id} key={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <fieldset>
            <legend>Verified attributes</legend>
            {features.map(([id, label]) => (
              <label key={id}>
                <input
                  type="checkbox"
                  checked={attributes.includes(id)}
                  onChange={() => {
                    transition();
                    setAttributes((values) =>
                      values.includes(id)
                        ? values.filter((v) => v !== id)
                        : [...values, id],
                    );
                  }}
                />
                {label}
              </label>
            ))}
          </fieldset>
          <p className="filter-help">
            A source link alone does not prove a license. Unknown platforms and
            facts are excluded from specific filters.
          </p>
        </div>
      )}
      <div className="results-toolbar">
        <p role="status" aria-live="polite" aria-atomic="true">
          {overview
            ? `${shownStacks.length} curated stacks`
            : `${results.length} ${results.length === 1 ? "tool" : "tools"}${category === "favorites" ? " saved on this browser" : ""}`}
          {activeFilters > 0 && (
            <>
              {" "}
              ·{" "}
              <button className="text-button" onClick={clearFilters}>
                Clear all filters
              </button>
            </>
          )}
        </p>
        <div>
          <button className="text-button" onClick={() => setShowCompare(true)}>
            <Scale size={17} />
            Compare
          </button>
          <button className="text-button" onClick={() => setRoulette(true)}>
            <Sparkles size={17} />
            Surprise me
          </button>
        </div>
      </div>
      {category === "favorites" && (
        <div className="favorites-toolbar">
          <div>
            <strong>Your useful little collection</strong>
            <p>Saved in this browser. Export every saved tool as text, or use a JSON backup to move devices.</p>
          </div>
          <div className="favorites-controls">
            <button className="button" onClick={() => fileRef.current?.click()}>
              <Upload size={16} />
              Import JSON
            </button>
            <details className="export-menu">
              <summary className="button">
                <Download size={16} />
                Export all favorites
              </summary>
              <div>
                {(["txt", "json", "md", "html"] as const).map((format) => (
                  <button
                    key={format}
                    disabled={!favorites.length}
                    onClick={() => exportFile(format)}
                  >
                    {format === "txt" ? "Plain text (.txt)" : `Download .${format}`}
                  </button>
                ))}
              </div>
            </details>
            {favorites.length > 0 && (
              <button
                className="button"
                aria-pressed={selectionMode}
                onClick={() => setSelectionMode((v) => !v)}
              >
                {selectionMode ? "Done selecting" : "Select tools"}
              </button>
            )}
            <input
              type="file"
              ref={fileRef}
              accept="application/json,.json"
              className="sr-only"
              tabIndex={-1}
              aria-label="Import favorites JSON"
              onChange={importFile}
            />
          </div>
        </div>
      )}
      {selectionMode && (
        <div className="selection-toolbar">
          <button
            className="button"
            onClick={() =>
              setSelected(
                selected.length === results.length
                  ? []
                  : results.map((i) => i.id),
              )
            }
          >
            Select matching tools
          </button>
          <span>{selected.length} selected</span>
          <button
            className="button"
            disabled={!selected.length}
            onClick={() => setConfirmRemove(true)}
          >
            Remove selected
          </button>
          <details>
            <summary>Open selected tools individually</summary>
            <p>
              Browsers limit opening many tabs at once. Use these safe links.
            </p>
            {selected.map((id) => {
              const item = items.find((i) => i.id === id)!;
              return (
                <a
                  key={id}
                  href={item.website || item.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title} ↗
                </a>
              );
            })}
          </details>
        </div>
      )}
      {overview ? (
        <div className="stack-grid">
          {shownStacks.map((s) => (
            <article className="stack-card" key={s.id}>
              <h3>
                <Link href={`/stacks/${s.id}`}>{s.title}</Link>
              </h3>
              <p>{s.description}</p>
              <div>
                <span>{s.itemIds.length} tools</span>
                <button
                  className="text-button"
                  onClick={() => {
                    transition();
                    setStack(s);
                    clearFilters();
                  }}
                >
                  Explore this kit <ArrowUpRight size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <>
          {stack && (
            <div className="stack-summary">
              <div>
                <button
                  className="text-button"
                  onClick={() => {
                    transition();
                    setStack(null);
                    clearFilters();
                  }}
                >
                  ← All stacks
                </button>
                <h2>{stack.title}</h2>
                <p>{stack.description}</p>
                <Link href={`/stacks/${stack.id}`}>
                  Read the workflow and tool roles →
                </Link>
              </div>
              <div>
                <button
                  className="button"
                  onClick={() => {
                    const added = stack.itemIds.filter(
                      (id) => !favorites.includes(id),
                    );
                    addFavorites(added);
                    setNotice(
                      `${added.length} new tools saved; ${stack.itemIds.length - added.length} already saved.`,
                    );
                  }}
                >
                  Save this stack
                </button>
                <button
                  className="button"
                  onClick={() => copy(`${location.origin}/stacks/${stack.id}`)}
                >
                  Share stack
                </button>
              </div>
            </div>
          )}
          {results.length ? (
            <div className="directory-grid">
              {results.slice(0, count).map((item) => (
                <DirectoryCard
                  key={item.id}
                  item={item}
                  isNew={now !== null && isRecentlyAdded(item.addedAt, now)}
                  isFav={isFavorite(item.id)}
                  isSelected={selected.includes(item.id)}
                  isSelectionMode={selectionMode}
                  onPreview={onPreview}
                  onSelectFavorite={(id) =>
                    setSelected((ids) =>
                      ids.includes(id)
                        ? ids.filter((v) => v !== id)
                        : [...ids, id],
                    )
                  }
                  toggleFavorite={save}
                  onCompare={toggleCompare}
                  compared={compareIds.includes(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Heart size={32} />
              <h3>
                {category === "favorites" && !favorites.length
                  ? "Your collection starts here"
                  : "No matching tools"}
              </h3>
              <p>
                {category === "favorites" && !favorites.length
                  ? "Save a tool using its heart, or import a JSON backup above."
                  : "Your collection is still here. Try another search or clear the active filters."}
              </p>
              <button
                className="button"
                onClick={() =>
                  category === "favorites" && !favorites.length
                    ? chooseCategory("all")
                    : clearFilters()
                }
              >
                {category === "favorites" && !favorites.length
                  ? "Explore tools"
                  : "Reset filters"}
              </button>
            </div>
          )}
          {count < results.length && (
            <div className="load-more">
              <button
                className="button button-primary"
                onClick={() => setCount((c) => c + 24)}
              >
                Show 24 more · {results.length - count} remaining
              </button>
              <p>
                Showing {Math.min(count, results.length)} of {results.length}
              </p>
            </div>
          )}
        </>
      )}
      {notice && (
        <div className="status-notice" role="status">
          <span>{notice}</span>
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={18} />
          </button>
        </div>
      )}
      {fallbackLink && !preview && (
        <label className="fallback-link">
          Link to copy
          <input
            readOnly
            value={fallbackLink}
            onFocus={(e) => e.currentTarget.select()}
          />
        </label>
      )}
      {compareIds.length > 0 && (
        <div className="compare-tray">
          <span>{compareIds.length} selected for comparison</span>
          <button
            className="button button-primary"
            onClick={() => setShowCompare(true)}
          >
            Compare selected
          </button>
          <button
            className="icon-button"
            aria-label="Clear comparison selection"
            onClick={() => setCompareIds([])}
          >
            <X size={18} />
          </button>
        </div>
      )}
      {preview && (
        <Modal
          label={`${preview.title} details`}
          onClose={() => {
            transition();
            setPreview(null);
          }}
          className="modal-overlay"
        >
          <div className="dialog-panel">
            <div className="dialog-heading">
              <h2>{preview.title}</h2>
              <button
                className="icon-button"
                aria-label="Close tool details"
                onClick={() => {
                  transition();
                  setPreview(null);
                }}
              >
                <X />
              </button>
            </div>
            <p>{preview.description}</p>
            <ComparisonFacts item={preview} />
            <div className="dialog-actions">
              <button
                className="button"
                aria-pressed={isFavorite(preview.id)}
                onClick={() => save(preview.id)}
              >
                {isFavorite(preview.id) ? "Saved" : "Save tool"}
              </button>
              <button
                className="button"
                onClick={() => {
                  toggleCompare(preview);
                  setNotice("Added to your comparison selection.");
                }}
              >
                Compare
              </button>
              <button
                className="button"
                onClick={() => copy(`${location.origin}/tools/${preview.id}`)}
              >
                Copy link
              </button>
            </div>
            {fallbackLink && (
              <label className="fallback-link">
                Link to copy
                <input
                  readOnly
                  value={fallbackLink}
                  onFocus={(e) => e.currentTarget.select()}
                />
              </label>
            )}
            <div className="dialog-actions">
              <Link href={`/tools/${preview.id}`}>
                Full details & alternatives →
              </Link>
              {!preview.linkUnavailable && (
                <a
                  className="button button-primary"
                  href={preview.website || preview.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit tool ↗
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}
      {confirmRemove && (
        <Modal
          label="Remove saved tools"
          onClose={() => setConfirmRemove(false)}
          className="modal-overlay"
        >
          <div className="dialog-panel">
            <h2>Remove {selected.length} saved tools?</h2>
            <p>
              This changes this browser’s collection. Export a backup first if
              you want to keep a copy.
            </p>
            <div className="dialog-actions">
              <button
                className="button"
                onClick={() => setConfirmRemove(false)}
              >
                Keep them
              </button>
              <button
                className="button button-primary"
                onClick={() => {
                  removeFavorites(selected);
                  setNotice(`${selected.length} tools removed.`);
                  setSelected([]);
                  setConfirmRemove(false);
                }}
              >
                Remove selected
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showCompare && (
        <CompareModal
          isOpen
          onClose={() => setShowCompare(false)}
          allItems={items}
          initialItems={compareIds.map((id) => items.find((i) => i.id === id)!)}
          favorites={favorites}
          onToggleFavorite={save}
        />
      )}
      {roulette && (
        <Roulette
          isOpen
          onClose={() => setRoulette(false)}
          items={results.length ? results : items}
          favorites={favorites}
          onToggleFavorite={save}
        />
      )}
      {palette && (
        <CommandPalette
          isOpen
          onClose={() => setPalette(false)}
          items={items}
          onSelectItem={onPreview}
          onOpenRandom={() => setRoulette(true)}
          onOpenFavorites={() => chooseCategory("favorites")}
          onOpenCompare={() => setShowCompare(true)}
          onExportFavorites={() => exportFile("json")}
        />
      )}
    </section>
  );
}

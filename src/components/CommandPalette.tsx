"use client";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { X, Search } from "lucide-react";
import type { Item } from "@/data/items";
import { searchItems } from "@/lib/item-search";
import Modal from "./Modal";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  onSelectItem: (item: Item) => void;
  onOpenRandom: () => void;
  onOpenFavorites: () => void;
  onOpenCompare: () => void;
  onExportFavorites: () => void;
  onOpenSandbox?: () => void;
}
export default function CommandPalette({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onOpenRandom,
  onOpenFavorites,
  onOpenCompare,
  onExportFavorites,
}: Props) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const [index, setIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const actions = [
    { id: "random", title: "Discover a random tool", run: onOpenRandom },
    { id: "favorites", title: "Open saved tools", run: onOpenFavorites },
    { id: "compare", title: "Compare tools", run: onOpenCompare },
    { id: "export", title: "Export JSON backup", run: onExportFavorites },
  ].filter(
    (a) => !query.trim() || a.title.toLowerCase().includes(query.toLowerCase()),
  );
  const results = [
    ...actions.map((a) => ({
      id: a.id,
      title: a.title,
      description: "Action",
      run: a.run,
    })),
    ...(deferred.trim()
      ? searchItems(items, deferred)
          .slice(0, 8)
          .map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            run: () => onSelectItem(item),
          }))
      : []),
  ];
  useEffect(() => {
    input.current?.focus();
  }, []);
  const activeId = results[index]?.id;
  useEffect(() => {
    document
      .getElementById(`command-${activeId}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeId]);
  if (!isOpen) return null;
  const activate = (i: number) => {
    const result = results[i];
    if (result) {
      onClose();
      result.run();
    }
  };
  return (
    <Modal
      label="Search tools and commands"
      onClose={onClose}
      className="modal-overlay"
    >
      <div className="dialog-panel command-panel">
        <div className="dialog-heading">
          <h2>Find something useful</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close command palette"
          >
            <X />
          </button>
        </div>
        <div className="command-search">
          <Search size={20} />
          <input
            ref={input}
            role="combobox"
            aria-label="Search tools and commands"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="command-results"
            aria-activedescendant={
              results[index] ? `command-${results[index].id}` : undefined
            }
            value={query}
            placeholder="Search tools or actions"
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) =>
                  results.length ? (i + 1) % results.length : 0,
                );
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) =>
                  results.length
                    ? (i + results.length - 1) % results.length
                    : 0,
                );
              }
              if (e.key === "Enter") {
                e.preventDefault();
                activate(index);
              }
            }}
          />
        </div>
        <div
          id="command-results"
          role="listbox"
          aria-label="Tools and actions"
          className="command-results"
        >
          {results.map((r, i) => (
            <div
              role="option"
              id={`command-${r.id}`}
              aria-selected={i === index}
              key={r.id}
              onMouseEnter={() => setIndex(i)}
              onClick={() => activate(i)}
            >
              <strong>{r.title}</strong>
              <span>{r.description}</span>
            </div>
          ))}
          {!results.length && (
            <p role="status">No matching tools or actions.</p>
          )}
        </div>
        <p className="field-hint">
          ↑ ↓ to navigate · Enter to choose · Escape to close
        </p>
      </div>
    </Modal>
  );
}

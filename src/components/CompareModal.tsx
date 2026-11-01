"use client";
import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { Item } from "@/data/items";
import Modal from "./Modal";
import { searchItems } from "@/lib/item-search";
import { formatCatalogDate } from "@/lib/catalog-dates";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  allItems: Item[];
  initialItems?: Item[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}
export default function CompareModal({
  isOpen,
  onClose,
  allItems,
  initialItems = [],
  favorites,
  onToggleFavorite,
}: Props) {
  const [selected, setSelected] = useState<Item[]>(initialItems.slice(0, 3));
  const [query, setQuery] = useState("");
  if (!isOpen) return null;
  const candidates = searchItems(allItems, query)
    .filter((i) => !selected.some((s) => s.id === i.id))
    .slice(0, 6);
  const fields: [string, (item: Item) => string][] = [
    ["Pricing", (i) => i.details?.pricing || "Not verified"],
    ["License", (i) => i.details?.license || "Not verified"],
    ["Account required", (i) => i.details?.accountRequired || "Not verified"],
    ["Offline support", (i) => i.details?.offlineSupport || "Not verified"],
  ];
  return (
    <Modal label="Compare tools" onClose={onClose} className="modal-overlay">
      <div className="dialog-panel compare-panel">
        <div className="dialog-heading">
          <div>
            <h2>Compare tools</h2>
            <p>Choose up to three. Unknown facts stay unknown.</p>
          </div>
          <button
            className="icon-button"
            aria-label="Close comparison"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {selected.length < 3 && (
          <div className="compare-picker">
            <label htmlFor="compare-search">Find a tool to compare</label>
            <input
              id="compare-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search names or tasks"
            />
            <div className="picker-results">
              {candidates.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelected([...selected, item]);
                    setQuery("");
                  }}
                >
                  Add {item.title}
                </button>
              ))}
            </div>
          </div>
        )}
        {selected.length === 0 ? (
          <p className="empty-note">
            Start with two tools you are considering. You can also add them from
            the catalog.
          </p>
        ) : (
          <div
            className="comparison-scroll"
            tabIndex={0}
            aria-label="Comparison table; scroll horizontally for more tools"
          >
            <table className="comparison-table">
              <caption className="sr-only">Verified tool attributes</caption>
              <thead>
                <tr>
                  <th scope="col">Attribute</th>
                  {selected.map((item) => (
                    <th scope="col" key={item.id}>
                      <Link href={`/tools/${item.id}`}>{item.title}</Link>
                      <button
                        className="icon-button"
                        aria-label={`Remove ${item.title} from comparison`}
                        onClick={() =>
                          setSelected(selected.filter((i) => i.id !== item.id))
                        }
                      >
                        <X size={16} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fields.map(([name, value]) => (
                  <tr key={name}>
                    <th scope="row">{name}</th>
                    {selected.map((i) => (
                      <td key={i.id}>{value(i)}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row">Notes & sources</th>
                  {selected.map((i) => (
                    <td key={i.id}>
                      {i.details ? (
                        <>
                          <p>{i.details.notes}</p>
                          <p>
                            Reviewed {formatCatalogDate(i.details.verifiedAt)}
                          </p>
                          {i.details.sources.map((url) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {new URL(url).hostname.replace(/^www\./, "")}{" "}
                              documentation
                            </a>
                          ))}
                        </>
                      ) : (
                        "This tool still needs a source review."
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Keep or visit</th>
                  {selected.map((i) => (
                    <td key={i.id}>
                      <button
                        className="button"
                        aria-pressed={favorites.includes(i.id)}
                        onClick={() => onToggleFavorite(i.id)}
                      >
                        {favorites.includes(i.id) ? "Saved" : "Save tool"}
                      </button>
                      {!i.linkUnavailable && (
                        <a
                          href={i.website || i.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit {i.title} ↗
                        </a>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
}

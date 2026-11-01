"use client";
import { useState } from "react";
import { X } from "lucide-react";
import type { Item } from "@/data/items";
import Modal from "./Modal";
import Link from "next/link";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}
export default function RandomRouletteModal({
  isOpen,
  onClose,
  items,
  favorites,
  onToggleFavorite,
}: Props) {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * Math.max(items.length, 1)),
  );
  if (!isOpen) return null;
  const item = items[index % items.length];
  return (
    <Modal label="Discover a tool" onClose={onClose} className="modal-overlay">
      <div className="dialog-panel">
        <div className="dialog-heading">
          <h2>A useful surprise</h2>
          <button
            className="icon-button"
            aria-label="Close discovery"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {item ? (
          <>
            <div
              className="random-result"
              aria-live="polite"
              aria-atomic="true"
            >
              <p>
                {item.category === "Softwares" ? "Software" : item.category}
              </p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <div className="dialog-actions">
              <button
                className="button"
                onClick={() =>
                  setIndex(
                    (i) =>
                      (i +
                        1 +
                        Math.floor(
                          Math.random() * Math.max(items.length - 1, 1),
                        )) %
                      items.length,
                  )
                }
              >
                Another tool
              </button>
              <button
                className="button"
                aria-pressed={favorites.includes(item.id)}
                onClick={() => onToggleFavorite(item.id)}
              >
                {favorites.includes(item.id) ? "Saved" : "Save tool"}
              </button>
              <Link href={`/tools/${item.id}`}>Read details →</Link>
              {!item.linkUnavailable && (
                <a
                  className="button button-primary"
                  href={item.website || item.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit tool ↗
                </a>
              )}
            </div>
          </>
        ) : (
          <p>No tools match these filters. Clear filters and try again.</p>
        )}
      </div>
    </Modal>
  );
}

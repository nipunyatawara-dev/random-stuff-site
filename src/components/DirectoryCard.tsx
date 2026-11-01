"use client";
import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import { ArrowUpRight, Heart, Scale, Check } from "lucide-react";
import type { Item } from "@/data/items";
import {
  getVisiblePlatformTags,
  isVerifiedOpenSource,
} from "@/lib/platform-tags";
type Props = {
  item: Item;
  isNew: boolean;
  isFav: boolean;
  isSelected: boolean;
  isSelectionMode: boolean;
  onPreview: (item: Item) => void;
  onSelectFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  onCompare?: (item: Item) => void;
  compared?: boolean;
};
export default memo(function DirectoryCard({
  item,
  isNew,
  isFav,
  isSelected,
  isSelectionMode,
  onPreview,
  onSelectFavorite,
  toggleFavorite,
  onCompare,
  compared,
}: Props) {
  const [failed, setFailed] = useState(false);
  const tags = getVisiblePlatformTags(item).filter((t) =>
    ["macos", "windows", "linux", "web", "cli", "terminal"].includes(t),
  );
  return (
    <article className="directory-card" aria-labelledby={`title-${item.id}`}>
      <div className="card-top">
        <span className="tool-icon">
          {failed ? (
            item.title.slice(0, 2)
          ) : (
            <Image
              unoptimized
              src={item.image!}
              width="44"
              height="44"
              alt=""
              loading="lazy"
              onError={() => setFailed(true)}
            />
          )}
        </span>
        <span className="card-kind">
          {item.category === "Softwares" ? "Software" : item.category}
          {isNew && <span className="new-badge">New</span>}
        </span>
      </div>
      <h3 id={`title-${item.id}`}>
        <Link href={`/tools/${item.id}`}>{item.title}</Link>
      </h3>
      <p className="card-description">{item.description}</p>
      <div className="card-tags">
        {item.linkUnavailable && <span>Link under review</span>}
        {tags.map((tag) => (
          <span key={tag}>
            {tag === "macos"
              ? "macOS"
              : tag === "cli"
                ? "CLI"
                : tag === "terminal"
                  ? "Terminal"
                  : tag[0].toUpperCase() + tag.slice(1)}
          </span>
        ))}
        {isVerifiedOpenSource(item) && <span>Verified open source</span>}
      </div>
      <div className="card-bottom">
        <button
          type="button"
          className="text-button"
          onClick={() => onPreview(item)}
          aria-haspopup="dialog"
        >
          Quick look
        </button>
        <div className="card-actions">
          {isSelectionMode && (
            <button
              className="icon-button"
              aria-label={`Select ${item.title}`}
              aria-pressed={isSelected}
              onClick={() => onSelectFavorite(item.id)}
            >
              <Check size={18} />
            </button>
          )}
          {onCompare && (
            <button
              className="icon-button"
              aria-label={`Compare ${item.title}`}
              aria-pressed={Boolean(compared)}
              onClick={() => onCompare(item)}
            >
              <Scale size={18} />
            </button>
          )}
          <button
            className={`icon-button ${isFav ? "is-saved" : ""}`}
            aria-label={`${isFav ? "Remove" : "Save"} ${item.title} ${isFav ? "from" : "to"} favorites`}
            aria-pressed={isFav}
            onClick={() => toggleFavorite(item.id)}
          >
            <Heart size={18} fill={isFav ? "currentColor" : "none"} />
          </button>
          {!item.linkUnavailable && (
            <a
              className="icon-button"
              href={item.website || item.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${item.title} (opens new tab)`}
            >
              <ArrowUpRight size={20} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
});

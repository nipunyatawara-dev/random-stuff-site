"use client";
import { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { copyText } from "@/lib/client-actions";
export default function ToolActions({
  ids,
  path,
}: {
  ids: string[];
  path: string;
}) {
  const { favorites, addFavorites, removeFavorites } = useFavorites();
  const [notice, setNotice] = useState(""),
    [fallback, setFallback] = useState("");
  const all = ids.every((id) => favorites.includes(id));
  return (
    <div>
      <div className="dialog-actions">
        <button
          className="button"
          aria-pressed={all}
          onClick={() => {
            if (all) {
              removeFavorites(ids);
              setNotice("Removed from this browser's saved tools.");
            } else {
              const fresh = ids.filter((id) => !favorites.includes(id));
              addFavorites(fresh);
              setNotice(
                `${fresh.length} tools added to this browser's saved tools.`,
              );
            }
          }}
        >
          {all
            ? "Saved on this browser"
            : ids.length === 1
              ? "Save tool"
              : "Save this stack"}
        </button>
        <button
          className="button"
          onClick={async () => {
            const link = location.origin + path;
            if (await copyText(link)) setNotice("Link copied.");
            else {
              setFallback(link);
              setNotice("Select and copy the link below.");
            }
          }}
        >
          Share link
        </button>
        {ids.length === 1 && (
          <a className="button" href={`/?tool=${ids[0]}#catalog-section`}>
            Compare in catalog
          </a>
        )}
      </div>
      <p role="status" className="field-hint">
        {notice}
      </p>
      {fallback && (
        <label className="fallback-link">
          Link to copy
          <input
            value={fallback}
            readOnly
            onFocus={(e) => e.currentTarget.select()}
          />
        </label>
      )}
    </div>
  );
}

import type { Item } from "@/data/items";
import { formatCatalogDate } from "@/lib/catalog-dates";
export default function ComparisonFacts({ item }: { item: Item }) {
  const d = item.details;
  return (
    <div className="comparison-facts">
      <dl>
        {[
          ["Pricing", d?.pricing],
          ["License", d?.license],
          ["Account", d?.accountRequired],
          ["Offline", d?.offlineSupport],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value || "Not verified"}</dd>
          </div>
        ))}
      </dl>
      {d?.notes && <p>{d.notes}</p>}
      {d && (
        <p className="fact-sources">
          Reviewed{" "}
          <time dateTime={d.verifiedAt}>{formatCatalogDate(d.verifiedAt)}</time>
          <br />
          {d.sources.map((url, index) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer">
              {new URL(url).hostname.replace(/^www\./, "")}
              {index > 0 ? " · license / documentation" : " · product / source"}
            </a>
          ))}
        </p>
      )}
    </div>
  );
}

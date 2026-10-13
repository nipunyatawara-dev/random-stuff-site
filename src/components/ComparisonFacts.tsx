import type { Item } from "@/data/items";
import { formatCatalogDate } from "@/lib/catalog-dates";

export default function ComparisonFacts({ item }: { item: Item }) {
  const details = item.details;
  const rows = [
    ["Pricing", details?.pricing],
    ["License", details?.license],
    ["Account required", details?.accountRequired],
    ["Offline support", details?.offlineSupport],
  ];
  return (
    <div className="mb-4">
      <dl className="space-y-2 text-xs border-t border-studio-neutral-200 pt-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-3">
            <dt className="text-studio-muted">{label}</dt>
            <dd className={`text-right font-medium ${value ? "text-studio-navy" : "text-studio-neutral-400"}`}>
              {value ?? "Not verified"}
            </dd>
          </div>
        ))}
      </dl>
      {details?.notes && <p className="mt-3 text-[11px] text-studio-muted leading-relaxed">{details.notes}</p>}
      {details && (
        <div className="mt-3 text-[10px] text-studio-neutral-400">
          <span>Checked {formatCatalogDate(details.verifiedAt)}</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {details.sources.map((source, index) => (
              <a key={source} href={source} target="_blank" rel="noopener noreferrer" className="text-studio-blue hover:underline">
                Source {index + 1}<span className="sr-only"> for {item.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

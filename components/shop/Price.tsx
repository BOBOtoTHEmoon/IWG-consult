import { gbp } from "@/lib/data";

// A price, with the "was" price crossed out beside it when the item is on offer.
// The was price only shows when it is higher than the price.
export default function Price({
  price,
  was,
  from = false,
  size = "md",
}: {
  price: number;
  was?: number | null;
  from?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const wasPrice = was ?? 0;
  const onOffer = wasPrice > price;
  const styles = {
    sm: { now: "text-sm font-semibold", was: "text-[13px] text-subtle" },
    md: { now: "text-[15px] sm:text-base", was: "text-[13px] text-subtle sm:text-sm" },
    lg: { now: "text-[28px] font-semibold", was: "text-lg text-subtle" },
  }[size];

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={`${styles.now} ${onOffer ? "text-clay" : "text-ink"}`}>
        {from ? "From " : ""}
        {gbp(price)}
      </span>
      {onOffer && (
        <>
          <span className={`${styles.was} line-through decoration-1`}>
            <span className="sr-only">Was </span>
            {gbp(wasPrice)}
          </span>
          {size === "lg" && (
            <span className="text-[15px] font-semibold text-clay">
              Save {from ? "up to " : ""}
              {gbp(wasPrice - price)}
            </span>
          )}
        </>
      )}
    </span>
  );
}

import Link from "next/link";
import { categoryName, gbp } from "@/lib/data";
import { LOW_STOCK, optionGroups, optionPlural, priceRange, type ShopProduct } from "@/lib/product-types";
import ProductImage from "../ProductImage";

export default function ProductCard({
  product,
  imageClass = "h-[240px] sm:h-[340px] lg:h-[380px]",
}: {
  product: ShopProduct;
  imageClass?: string;
}) {
  const soldOut = product.stock === 0;
  const lowStock = !soldOut && product.stock <= LOW_STOCK;
  // Goody's own label wins over Best seller.
  const tag = soldOut ? "Sold out" : (product.tag || (product.bestSeller ? "Best seller" : null));
  const { min, max } = priceRange(product);
  // "3 sizes, 5 colours" or "4 colours"
  const choices =
    product.options.length > 1
      ? optionGroups(product)
          .map((g) => optionPlural(g.label, g.values.length))
          .join(", ")
      : "";

  return (
    <Link href={`/product/${product.slug}`} className="group flex flex-col gap-4 text-ink">
      <div className="relative overflow-hidden rounded-[18px]">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          tint={product.tint}
          label="Product photo"
          className={`${imageClass} transition-transform duration-500 group-hover:scale-[1.02]`}
        />
        {tag && (
          <span className="absolute left-3.5 top-3.5 flex h-7 items-center rounded-full bg-paper px-3 text-xs font-semibold">
            {tag}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[13px] text-subtle">{categoryName(product.category)}</span>
        <span className="text-base font-semibold sm:text-[17px]">{product.name}</span>
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-[15px] sm:text-base">
            {min !== max ? "From " : ""}
            {gbp(min)}
          </span>
          {choices && <span className="text-[13px] text-subtle">{choices}</span>}
        </span>
        {(lowStock || product.sold > 0) && (
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-semibold">
            {lowStock && <span className="text-clay">Only {product.stock} left</span>}
            {product.sold > 0 && <span className="text-subtle">{product.sold} sold</span>}
          </span>
        )}
      </div>
    </Link>
  );
}
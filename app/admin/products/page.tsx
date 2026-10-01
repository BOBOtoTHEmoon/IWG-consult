import Link from "next/link";
import ProductList from "@/components/admin/ProductList";
import { PlusIcon } from "@/components/Icons";
import { getAllProducts } from "@/lib/products";

export default async function AdminProducts() {
  const products = await getAllProducts();
  const live = products.filter((p) => p.status === "live").length;
  const drafts = products.length - live;

  return (
    <main className="mx-auto flex max-w-[1100px] flex-col gap-5 px-4 py-6 sm:px-8 lg:py-9">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[30px] leading-tight sm:text-[40px]">Products</h1>
          <span className="text-sm text-subtle">
            {live} live{drafts > 0 ? `, ${drafts} ${drafts === 1 ? "draft" : "drafts"}` : ""}
          </span>
        </div>
        <Link
          href="/admin/products/new"
          className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-clay px-4 text-sm font-semibold text-white hover:bg-clay-dark sm:h-[46px] sm:px-5 sm:text-[15px]"
        >
          <PlusIcon size={18} />
          Add product
        </Link>
      </div>
      <ProductList products={products} />
    </main>
  );
}
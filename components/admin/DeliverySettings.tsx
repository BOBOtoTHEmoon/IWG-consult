"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { refreshShop } from "@/app/admin/actions";
import { COUNTRIES, countryName } from "@/lib/countries";
import { gbp } from "@/lib/data";
import { deliveryTime, kg, type ShippingMethod, type ShippingZone } from "@/lib/shipping-types";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeftIcon, CloseIcon, PenIcon, PlusIcon, SearchIcon, TrashIcon } from "../Icons";
import Sheet from "./Sheet";

const input = "h-12 w-full rounded-xl border-[1.5px] border-line-strong bg-white px-3.5 text-base font-normal text-ink";
const label = "flex flex-col gap-2 text-sm font-semibold";

const priceSummary = (m: ShippingMethod) => {
  let s =
    m.pricing === "flat"
      ? m.price === 0
        ? "Free"
        : gbp(m.price)
      : m.weightBands.length
        ? `By weight, ${gbp(Math.min(...m.weightBands.map((b) => b.price)))} to ${gbp(Math.max(...m.weightBands.map((b) => b.price)))}`
        : "By weight, no bands yet";
  if (m.freeOver != null) s += `. Free over ${gbp(m.freeOver)}`;
  return s;
};

const zoneSummary = (z: ShippingZone) =>
  z.restOfWorld
    ? "Every country not in another zone"
    : z.countries.length === 0
      ? "No countries yet"
      : z.countries.length <= 3
        ? z.countries.map(countryName).join(", ")
        : `${z.countries.length} countries`;

export default function DeliverySettings({ zones, methods }: { zones: ShippingZone[]; methods: ShippingMethod[] }) {
  const router = useRouter();
  const [editingZone, setEditingZone] = useState<ShippingZone | "new" | null>(null);
  const [editingMethod, setEditingMethod] = useState<{ zone: ShippingZone; method?: ShippingMethod } | null>(null);
  const [error, setError] = useState("");

  const done = useCallback(async () => {
    setEditingZone(null);
    setEditingMethod(null);
    await refreshShop();
    router.refresh();
  }, [router]);

  async function toggle(m: ShippingMethod) {
    setError("");
    const supabase = createClient();
    const { error: e } = await supabase.from("shipping_methods").update({ active: !m.active }).eq("id", m.id);
    if (e) return setError("We couldn't update that option. Please try again.");
    await done();
  }

  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-5 px-4 pb-28 pt-6 sm:px-8 lg:py-9">
      <Link href="/admin/more" className="-ml-2 flex h-10 items-center gap-1 self-start rounded-full pr-3 text-sm font-semibold text-ink lg:hidden">
        <ChevronLeftIcon size={20} />
        More
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[30px] leading-tight sm:text-[40px]">Delivery</h1>
        <p className="text-[15px] text-muted">
          Where you deliver, the options customers can choose, and what they cost. Changes show at checkout straight away.
        </p>
      </div>

      {error && <p role="alert" className="rounded-xl bg-[#f6ddd0] px-3.5 py-2.5 text-sm font-semibold text-clay-dark">{error}</p>}

      {zones.map((z) => {
        const zoneMethods = methods.filter((m) => m.zoneId === z.id).sort((a, b) => a.sortOrder - b.sortOrder);
        return (
          <section key={z.id} className="flex flex-col gap-3 rounded-[20px] border border-line bg-paper p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-0.5">
                <h2 className="text-lg font-bold">{z.name}</h2>
                <span className="text-sm text-subtle">{zoneSummary(z)}</span>
              </div>
              <button
                onClick={() => setEditingZone(z)}
                className="flex h-10 shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-line-strong bg-white px-3.5 text-sm font-semibold text-ink"
              >
                <PenIcon size={15} />
                Edit zone
              </button>
            </div>

            {zoneMethods.length === 0 && (
              <p className="rounded-xl bg-[#f1e6c8] px-3.5 py-3 text-sm text-[#6e5316]">
                No delivery options yet, so customers in this zone can&apos;t check out. Add at least one.
              </p>
            )}

            <ul className="flex flex-col gap-2">
              {zoneMethods.map((m) => (
                <li key={m.id} className={`flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 ${m.active ? "" : "opacity-60"}`}>
                  <button onClick={() => setEditingMethod({ zone: z, method: m })} className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                    <span className="font-semibold">{m.name}</span>
                    <span className="text-[13px] text-muted">
                      {[deliveryTime(m), priceSummary(m)].filter(Boolean).join(". ")}
                    </span>
                  </button>
                  <label className="flex shrink-0 items-center gap-2 text-[13px] font-semibold text-subtle">
                    <span className="hidden sm:inline">{m.active ? "On" : "Off"}</span>
                    <input
                      type="checkbox"
                      checked={m.active}
                      onChange={() => toggle(m)}
                      aria-label={`${m.name} ${m.active ? "on" : "off"}`}
                      className="h-[22px] w-[22px] accent-jade"
                    />
                  </label>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setEditingMethod({ zone: z })}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-clay text-sm font-bold text-clay"
            >
              <PlusIcon size={16} />
              Add a delivery option
            </button>
          </section>
        );
      })}

      <button
        onClick={() => setEditingZone("new")}
        className="flex h-12 items-center justify-center gap-2 rounded-full border-[1.5px] border-line-strong bg-paper text-[15px] font-semibold text-ink"
      >
        <PlusIcon size={18} />
        Add a zone
      </button>

      {editingZone && (
        <ZoneEditor zone={editingZone === "new" ? undefined : editingZone} zones={zones} onClose={() => setEditingZone(null)} onSaved={done} />
      )}
      {editingMethod && (
        <MethodEditor
          zone={editingMethod.zone}
          method={editingMethod.method}
          nextOrder={methods.filter((m) => m.zoneId === editingMethod.zone.id).length + 1}
          onClose={() => setEditingMethod(null)}
          onSaved={done}
        />
      )}
    </main>
  );
}

// ---------- Zone editor ----------

function ZoneEditor({
  zone,
  zones,
  onClose,
  onSaved,
}: {
  zone?: ShippingZone;
  zones: ShippingZone[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(zone?.name ?? "");
  const [selected, setSelected] = useState<string[]>(zone?.countries ?? []);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const restOfWorld = zone?.restOfWorld ?? false;

  // A country can only be in one zone.
  const takenBy = useMemo(() => {
    const map = new Map<string, string>();
    zones.forEach((z) => z.id !== zone?.id && z.countries.forEach((c) => map.set(c, z.name)));
    return map;
  }, [zones, zone]);

  const q = query.trim().toLowerCase();
  const list = COUNTRIES.filter((c) => !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q);

  const toggle = (code: string) =>
    setSelected((s) => (s.includes(code) ? s.filter((c) => c !== code) : [...s, code]));

  async function save() {
    setError("");
    if (!name.trim()) return setError("Give the zone a name.");
    if (!restOfWorld && selected.length === 0) return setError("Choose at least one country.");
    setBusy(true);
    const supabase = createClient();
    const row = { name: name.trim(), countries: restOfWorld ? [] : selected };
    const { error: e } = zone
      ? await supabase.from("shipping_zones").update(row).eq("id", zone.id)
      : await supabase.from("shipping_zones").insert({ ...row, sort_order: zones.length + 1 });
    setBusy(false);
    if (e) return setError("We couldn't save the zone. Please try again.");
    onSaved();
  }

  async function remove() {
    if (!zone) return;
    setBusy(true);
    const supabase = createClient();
    const { error: e } = await supabase.from("shipping_zones").delete().eq("id", zone.id);
    setBusy(false);
    if (e) return setError("We couldn't delete the zone. Please try again.");
    onSaved();
  }

  return (
    <Sheet
      title={zone ? "Edit zone" : "New zone"}
      onClose={onClose}
      footer={
        <>
          {error && <p role="alert" className="rounded-xl bg-[#f6ddd0] px-3.5 py-2.5 text-sm font-semibold text-clay-dark">{error}</p>}
          <button onClick={save} disabled={busy} className="h-12 rounded-full bg-clay font-semibold text-white disabled:opacity-60">
            {busy ? "Saving..." : "Save zone"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <label className={label}>
          Zone name
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="e.g. Nigeria, or North America" className={input} />
        </label>

        {restOfWorld ? (
          <p className="rounded-xl bg-paper px-4 py-3 text-sm leading-relaxed text-muted">
            This zone covers every country that isn&apos;t in another zone, so there&apos;s nothing to choose here.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            <span className="text-sm font-semibold">
              Countries <span className="font-normal text-subtle">({selected.length} chosen)</span>
            </span>
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selected.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggle(c)}
                    className="flex h-8 items-center gap-1 rounded-full bg-ink pl-3 pr-2 text-[13px] font-semibold text-cream"
                  >
                    {countryName(c)}
                    <CloseIcon size={13} />
                  </button>
                ))}
              </div>
            )}
            <label className="relative block">
              <span className="sr-only">Search countries</span>
              <SearchIcon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search countries"
                className={`${input} pl-10`}
              />
            </label>
            <ul className="flex max-h-64 flex-col overflow-y-auto rounded-xl border border-line bg-white">
              {list.map((c) => {
                const other = takenBy.get(c.code);
                return (
                  <li key={c.code}>
                    <label className={`flex min-h-11 items-center gap-3 border-b border-[#f0e9de] px-3.5 text-[15px] last:border-b-0 ${other ? "text-subtle" : "cursor-pointer"}`}>
                      <input
                        type="checkbox"
                        checked={selected.includes(c.code)}
                        disabled={Boolean(other)}
                        onChange={() => toggle(c.code)}
                        className="h-[18px] w-[18px] accent-clay"
                      />
                      <span className="flex-1">{c.name}</span>
                      {other && <span className="text-xs">In {other}</span>}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {zone && !restOfWorld && (
          <div className="rounded-xl border border-line bg-paper p-4">
            {confirmDelete ? (
              <div className="flex flex-col gap-3">
                <p className="text-[15px] font-semibold">
                  Delete {zone.name} and its delivery options? Its countries will use &quot;Rest of the world&quot; instead.
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button onClick={() => setConfirmDelete(false)} className="h-11 rounded-full border-[1.5px] border-line-strong bg-white font-semibold">
                    Keep it
                  </button>
                  <button onClick={remove} disabled={busy} className="h-11 rounded-full bg-clay-dark font-semibold text-white disabled:opacity-60">
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="flex h-10 items-center gap-2 text-[15px] font-semibold text-clay-dark">
                <TrashIcon size={18} />
                Delete zone
              </button>
            )}
          </div>
        )}
      </div>
    </Sheet>
  );
}

// ---------- Delivery option editor ----------

type BandRow = { key: number; kg: string; price: string };

function MethodEditor({
  zone,
  method,
  nextOrder,
  onClose,
  onSaved,
}: {
  zone: ShippingZone;
  method?: ShippingMethod;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(method?.name ?? "");
  const [minDays, setMinDays] = useState(method?.minDays != null ? String(method.minDays) : "");
  const [maxDays, setMaxDays] = useState(method?.maxDays != null ? String(method.maxDays) : "");
  const [pricing, setPricing] = useState<"flat" | "weight">(method?.pricing ?? "flat");
  const [price, setPrice] = useState(method ? method.price.toFixed(2) : "");
  const [bands, setBands] = useState<BandRow[]>(
    method?.weightBands.length
      ? method.weightBands.map((b, i) => ({ key: i, kg: String(b.upTo / 1000), price: b.price.toFixed(2) }))
      : [
          { key: 0, kg: "1", price: "" },
          { key: 1, kg: "2", price: "" },
        ]
  );
  const [hasFreeOver, setHasFreeOver] = useState(method?.freeOver != null);
  const [freeOver, setFreeOver] = useState(method?.freeOver != null ? String(method.freeOver) : "");
  const [active, setActive] = useState(method?.active ?? true);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  const updateBand = (key: number, changes: Partial<BandRow>) =>
    setBands((b) => b.map((x) => (x.key === key ? { ...x, ...changes } : x)));

  async function save() {
    setError("");
    if (!name.trim()) return setError("Give the option a name, e.g. UK Standard, Royal Mail.");
    const min = minDays === "" ? null : Math.floor(Number(minDays));
    const max = maxDays === "" ? null : Math.floor(Number(maxDays));
    if ((min != null && (isNaN(min) || min < 0)) || (max != null && (isNaN(max) || max < 0))) return setError("Delivery days must be 0 or more.");
    if (min != null && max != null && min > max) return setError("The first number of days should be the smaller one.");

    let weightBands: { upTo: number; price: number }[] = [];
    if (pricing === "flat") {
      if (price === "" || !(Number(price) >= 0)) return setError("Add a price. Use 0 for free.");
    } else {
      const filled = bands.filter((b) => b.kg !== "" || b.price !== "");
      if (filled.length === 0) return setError("Add at least one weight band.");
      weightBands = filled.map((b) => ({ upTo: Math.round(Number(b.kg) * 1000), price: Number(Number(b.price).toFixed(2)) }));
      if (weightBands.some((b) => !(b.upTo > 0) || !(b.price >= 0) || isNaN(b.price))) {
        return setError("Each weight band needs a weight above 0 kg and a price.");
      }
      weightBands.sort((a, b) => a.upTo - b.upTo);
      if (new Set(weightBands.map((b) => b.upTo)).size !== weightBands.length) return setError("Two weight bands have the same weight.");
    }
    if (hasFreeOver && !(Number(freeOver) > 0)) return setError("Add the order total for free delivery, or untick it.");

    setBusy(true);
    const supabase = createClient();
    const row = {
      name: name.trim(),
      min_days: min,
      max_days: max,
      pricing,
      price: pricing === "flat" ? Number(Number(price).toFixed(2)) : 0,
      weight_bands: weightBands,
      free_over: hasFreeOver ? Number(Number(freeOver).toFixed(2)) : null,
      active,
    };
    const { error: e } = method
      ? await supabase.from("shipping_methods").update(row).eq("id", method.id)
      : await supabase.from("shipping_methods").insert({ ...row, zone_id: zone.id, sort_order: nextOrder });
    setBusy(false);
    if (e) return setError("We couldn't save the option. Please try again.");
    onSaved();
  }

  async function remove() {
    if (!method) return;
    setBusy(true);
    const supabase = createClient();
    const { error: e } = await supabase.from("shipping_methods").delete().eq("id", method.id);
    setBusy(false);
    if (e) return setError("We couldn't delete the option. Please try again.");
    onSaved();
  }

  return (
    <Sheet
      title={method ? `Edit option, ${zone.name}` : `New option, ${zone.name}`}
      onClose={onClose}
      footer={
        <>
          {error && <p role="alert" className="rounded-xl bg-[#f6ddd0] px-3.5 py-2.5 text-sm font-semibold text-clay-dark">{error}</p>}
          <button onClick={save} disabled={busy} className="h-12 rounded-full bg-clay font-semibold text-white disabled:opacity-60">
            {busy ? "Saving..." : "Save option"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <label className={label}>
          Name customers see
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="e.g. UK Standard, Royal Mail" className={input} />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">
            Delivery time <span className="font-normal text-subtle">(working days, optional)</span>
          </span>
          <div className="flex items-center gap-2.5">
            <input value={minDays} onChange={(e) => setMinDays(e.target.value)} type="number" min={0} placeholder="From" aria-label="From days" className={input} />
            <span className="shrink-0 text-sm text-subtle">to</span>
            <input value={maxDays} onChange={(e) => setMaxDays(e.target.value)} type="number" min={0} placeholder="To" aria-label="To days" className={input} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">How is it priced?</span>
          <div className="grid grid-cols-2 gap-2">
            {(["flat", "weight"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPricing(p)}
                aria-pressed={pricing === p}
                className={`flex flex-col gap-0.5 rounded-xl border-[1.5px] px-3.5 py-3 text-left ${pricing === p ? "border-ink bg-white" : "border-line-strong"}`}
              >
                <span className="text-[15px] font-semibold">{p === "flat" ? "One price" : "By weight"}</span>
                <span className="text-[13px] text-subtle">{p === "flat" ? "Same for any order" : "Goes up with the parcel weight"}</span>
              </button>
            ))}
          </div>
        </div>

        {pricing === "flat" ? (
          <label className={label}>
            Price (£)
            <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" placeholder="e.g. 3.50" className={input} />
          </label>
        ) : (
          <div className="flex flex-col gap-2.5">
            <span className="text-sm font-semibold">
              Weight bands <span className="font-normal text-subtle">(uses each product&apos;s weight)</span>
            </span>
            {bands.map((b, i) => (
              <div key={b.key} className="flex items-end gap-2">
                <label className="flex flex-1 flex-col gap-1.5 text-xs font-semibold text-subtle">
                  Up to (kg)
                  <input value={b.kg} onChange={(e) => updateBand(b.key, { kg: e.target.value })} inputMode="decimal" placeholder="e.g. 1" className={input} />
                </label>
                <label className="flex flex-1 flex-col gap-1.5 text-xs font-semibold text-subtle">
                  Price (£)
                  <input value={b.price} onChange={(e) => updateBand(b.key, { price: e.target.value })} inputMode="decimal" placeholder="e.g. 3.50" className={input} />
                </label>
                <button
                  type="button"
                  onClick={() => setBands((all) => (all.length > 1 ? all.filter((x) => x.key !== b.key) : all))}
                  disabled={bands.length === 1}
                  aria-label={`Remove band ${i + 1}`}
                  className="flex h-12 w-10 shrink-0 items-center justify-center rounded-xl text-subtle hover:bg-sand disabled:opacity-30"
                >
                  <CloseIcon size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setBands((all) => [...all, { key: Date.now(), kg: "", price: "" }])}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-clay text-sm font-bold text-clay"
            >
              <PlusIcon size={16} />
              Add a weight band
            </button>
            <p className="text-[13px] leading-relaxed text-subtle">
              Orders heavier than your biggest band won&apos;t be offered this option, so you&apos;re never undercharged.
              {bands.some((b) => Number(b.kg) > 0) &&
                ` Right now that's anything over ${kg(Math.max(...bands.map((b) => Number(b.kg) * 1000 || 0)))}.`}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-white p-3.5">
          <label className="flex items-center gap-3 text-[15px] font-semibold">
            <input type="checkbox" checked={hasFreeOver} onChange={(e) => setHasFreeOver(e.target.checked)} className="h-5 w-5 accent-jade" />
            Free when the order is over a certain amount
          </label>
          {hasFreeOver && (
            <label className={label}>
              Free on orders over (£)
              <input value={freeOver} onChange={(e) => setFreeOver(e.target.value)} inputMode="decimal" placeholder="e.g. 50" className={input} />
            </label>
          )}
        </div>

        <label className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white p-3.5">
          <span className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold">Show at checkout</span>
            <span className="text-[13px] text-subtle">Switch off to hide it without deleting it</span>
          </span>
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-[22px] w-[22px] accent-jade" />
        </label>

        {method && (
          <div className="rounded-xl border border-line bg-paper p-4">
            {confirmDelete ? (
              <div className="flex flex-col gap-3">
                <p className="text-[15px] font-semibold">Delete {method.name}?</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button onClick={() => setConfirmDelete(false)} className="h-11 rounded-full border-[1.5px] border-line-strong bg-white font-semibold">
                    Keep it
                  </button>
                  <button onClick={remove} disabled={busy} className="h-11 rounded-full bg-clay-dark font-semibold text-white disabled:opacity-60">
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="flex h-10 items-center gap-2 text-[15px] font-semibold text-clay-dark">
                <TrashIcon size={18} />
                Delete option
              </button>
            )}
          </div>
        )}
      </div>
    </Sheet>
  );
}
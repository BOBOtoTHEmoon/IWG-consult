"use client";

import { useEffect, useRef, useState } from "react";
import { guessColour } from "@/lib/colour-names";
import { OPTION_LABELS, productImageUrl, type ShopProduct } from "@/lib/product-types";
import { uniqueId } from "@/lib/unique-id";
import { CameraIcon, CloseIcon, PlusIcon } from "../Icons";

// The editor for products with two option types, e.g. Size and Colour.
// Staff list the sizes and the colours once; every combination (Large / Black...) gets its own stock and price.

export type ValueRow = { key: string; name: string; hex: string; hexTouched: boolean; imagePath?: string; file?: File; preview?: string };
export type ComboCell = { stock: string; price: string };
export type ComboState = { a: ValueRow[]; b: ValueRow[]; cells: Record<string, ComboCell> };
export type BuiltCombo = { name: string; values: [string, string]; stock: number; price?: number; hex?: string; photoRow: ValueRow };

const DEFAULT_HEX = "#3b3733";
const cellKey = (a: ValueRow, b: ValueRow) => `${a.key}|${b.key}`;
const plural = (label: string) => `${label.toLowerCase()}s`;
export const newValueRow = (name = ""): ValueRow => ({ key: uniqueId(), name, hex: guessColour(name) ?? DEFAULT_HEX, hexTouched: false });

// The list that carries swatches and photos: the Colour one, otherwise the first.
export const visualIndex = (labelA: string, labelB: string) => (labelB === "Colour" && labelA !== "Colour" ? 1 : 0);

// Rebuilds the editor from a saved product.
export function comboStateFromProduct(product?: ShopProduct): ComboState {
  const ok = product?.optionLabel2 && product.options.length > 0 && product.options.every((o) => o.values?.length === 2);
  if (!product || !ok) return { a: [newValueRow()], b: [newValueRow()], cells: {} };
  const vi = visualIndex(product.optionLabel, product.optionLabel2!);
  const rowsFor = (i: number): ValueRow[] =>
    [...new Set(product.options.map((o) => o.values![i]))].map((name) => {
      const first = product.options.find((o) => o.values![i] === name)!;
      return { key: uniqueId(), name, hex: i === vi && first.hex ? first.hex : DEFAULT_HEX, hexTouched: true, imagePath: i === vi ? first.image : undefined };
    });
  const a = rowsFor(0);
  const b = rowsFor(1);
  const cells: Record<string, ComboCell> = {};
  for (const o of product.options) {
    const ra = a.find((r) => r.name === o.values![0])!;
    const rb = b.find((r) => r.name === o.values![1])!;
    cells[cellKey(ra, rb)] = { stock: String(o.stock), price: o.price != null ? o.price.toFixed(2) : "" };
  }
  return { a, b, cells };
}

// Starting a second option type from the single list the product already has.
export function comboStateFromRows(rows: { name: string; hex: string; imagePath?: string; file?: File; preview?: string }[]): ComboState {
  const named = rows.filter((r) => r.name.trim());
  return {
    a: named.length ? named.map((r) => ({ ...r, key: uniqueId(), hexTouched: true })) : [newValueRow()],
    b: [newValueRow()],
    cells: {},
  };
}

export function comboTotal(s: ComboState) {
  let total = 0;
  for (const a of s.a) for (const b of s.b) if (a.name.trim() && b.name.trim()) total += Math.max(0, Math.floor(Number(s.cells[cellKey(a, b)]?.stock) || 0));
  return total;
}

// Checks the lists and turns them into one option per combination, ready to save.
export function checkCombos(
  s: ComboState,
  labelA: string,
  labelB: string,
  basePrice: string
): { ok: true; combos: BuiltCombo[] } | { ok: false; error: string } {
  const a = s.a.filter((r) => r.name.trim());
  const b = s.b.filter((r) => r.name.trim());
  if (!a.length || !b.length) return { ok: false, error: `Add at least one ${labelA.toLowerCase()} and one ${labelB.toLowerCase()}.` };
  if (a.length * b.length < 2) return { ok: false, error: "Add at least two combinations, or remove the second option." };
  if (a.length * b.length > 100) return { ok: false, error: "That's more than 100 combinations. Please use fewer choices." };
  for (const [rows, label] of [[a, labelA], [b, labelB]] as const) {
    const names = rows.map((r) => r.name.trim().toLowerCase());
    if (new Set(names).size !== names.length) return { ok: false, error: `Two ${plural(label)} have the same name. Give each one a different name.` };
    if (rows.some((r) => r.name.includes("/"))) return { ok: false, error: `${label} names can't contain "/".` };
  }

  const vi = visualIndex(labelA, labelB);
  const isColour = (vi === 0 ? labelA : labelB) === "Colour";
  const base = Number(Number(basePrice).toFixed(2));
  const combos: BuiltCombo[] = [];
  for (const ra of a) {
    for (const rb of b) {
      const cell = s.cells[cellKey(ra, rb)] ?? { stock: "", price: "" };
      const name = `${ra.name.trim()} / ${rb.name.trim()}`;
      const p = cell.price.trim();
      if (p !== "" && !(Number(p) > 0)) return { ok: false, error: `Give ${name} a price greater than £0, or leave it blank to use the product price.` };
      const price = p === "" ? undefined : Number(Number(p).toFixed(2));
      const visual = vi === 0 ? ra : rb;
      combos.push({
        name,
        values: [ra.name.trim(), rb.name.trim()],
        stock: Math.max(0, Math.floor(Number(cell.stock) || 0)),
        ...(price !== undefined && price !== base ? { price } : {}),
        ...(isColour ? { hex: visual.hex } : {}),
        photoRow: visual,
      });
    }
  }
  return { ok: true, combos };
}

const small = "h-11 rounded-xl border-[1.5px] border-line-strong bg-white px-3 text-base font-normal text-ink";

export default function OptionCombosEditor({
  labelA,
  labelB,
  onLabelB,
  onRemove,
  state,
  onChange,
  basePrice,
}: {
  labelA: string;
  labelB: string;
  onLabelB: (label: string) => void;
  onRemove: () => void;
  state: ComboState;
  onChange: (next: ComboState) => void;
  basePrice: string;
}) {
  const [fillStock, setFillStock] = useState("");
  const previews = useRef<string[]>([]);
  useEffect(() => () => previews.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const vi = visualIndex(labelA, labelB);
  const lists = [
    { label: labelA, rows: state.a, side: "a" as const },
    { label: labelB, rows: state.b, side: "b" as const },
  ];

  const setRows = (side: "a" | "b", rows: ValueRow[]) => onChange({ ...state, [side]: rows });
  const updateRow = (side: "a" | "b", key: string, changes: Partial<ValueRow>) =>
    setRows(side, state[side].map((r) => (r.key === key ? { ...r, ...changes } : r)));
  // Typing a colour name fills the swatch, until staff pick a swatch themselves.
  const rename = (side: "a" | "b", row: ValueRow, name: string) =>
    updateRow(side, row.key, { name, ...(row.hexTouched ? {} : { hex: guessColour(name) ?? row.hex }) });
  const pickPhoto = (side: "a" | "b", key: string, file: File) => {
    const url = URL.createObjectURL(file);
    previews.current.push(url);
    updateRow(side, key, { file, preview: url });
  };

  const namedA = state.a.filter((r) => r.name.trim());
  const namedB = state.b.filter((r) => r.name.trim());
  const setCell = (a: ValueRow, b: ValueRow, changes: Partial<ComboCell>) => {
    const k = cellKey(a, b);
    const current = state.cells[k] ?? { stock: "", price: "" };
    onChange({ ...state, cells: { ...state.cells, [k]: { ...current, ...changes } } });
  };
  const fillAll = () => {
    const cells = { ...state.cells };
    for (const a of namedA) for (const b of namedB) cells[cellKey(a, b)] = { price: cells[cellKey(a, b)]?.price ?? "", stock: fillStock };
    onChange({ ...state, cells });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">Second option</span>
        <div className="flex flex-wrap gap-2">
          {OPTION_LABELS.filter((l) => l !== labelA).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onLabelB(l)}
              aria-pressed={labelB === l}
              className={`h-10 rounded-full border-[1.5px] px-4 text-sm font-semibold ${
                labelB === l ? "border-ink bg-ink text-cream" : "border-line-strong text-ink"
              }`}
            >
              {l}
            </button>
          ))}
          <button type="button" onClick={onRemove} className="h-10 px-2 text-sm font-semibold text-clay-dark hover:underline">
            Remove second option
          </button>
        </div>
      </div>

      {lists.map(({ label, rows, side }, li) => (
        <div key={side} className="flex flex-col gap-2.5">
          <span className="text-sm font-semibold">{label}s</span>
          <ul className="flex flex-col gap-2">
            {rows.map((r, i) => {
              const visual = li === vi;
              const photo = r.preview ?? (r.imagePath ? productImageUrl(r.imagePath) : undefined);
              return (
                <li key={r.key} className="flex items-center gap-2 rounded-2xl border border-line bg-paper p-2">
                  {visual && (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-[1.5px] border-dashed border-[#b3a591] bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {photo && <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />}
                      <label
                        className={`relative flex h-full w-full cursor-pointer items-center justify-center ${
                          photo ? "text-transparent hover:bg-ink/30 hover:text-cream" : "text-muted"
                        }`}
                      >
                        <CameraIcon size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          aria-label={`Photo for ${r.name || `${label.toLowerCase()} ${i + 1}`}`}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) pickPhoto(side, r.key, f);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      {photo && (
                        <button
                          type="button"
                          onClick={() => updateRow(side, r.key, { file: undefined, preview: undefined, imagePath: undefined })}
                          aria-label="Remove photo"
                          className="absolute right-0.5 top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-paper/90 text-ink"
                        >
                          <CloseIcon size={12} />
                        </button>
                      )}
                    </div>
                  )}
                  {label === "Colour" && (
                    <input
                      type="color"
                      value={r.hex}
                      onChange={(e) => updateRow(side, r.key, { hex: e.target.value, hexTouched: true })}
                      aria-label={`Swatch for ${r.name || `colour ${i + 1}`}`}
                      className="h-11 w-11 shrink-0 cursor-pointer rounded-xl border-[1.5px] border-line-strong bg-white p-1"
                    />
                  )}
                  <input
                    value={r.name}
                    onChange={(e) => rename(side, r, e.target.value)}
                    maxLength={30}
                    aria-label={`${label} name`}
                    placeholder={label === "Colour" ? "e.g. Black" : label === "Size" ? "e.g. Large" : label === "Length" ? 'e.g. 22"' : "e.g. Curly"}
                    className={`${small} min-w-0 flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => rows.length > 1 && setRows(side, rows.filter((x) => x.key !== r.key))}
                    disabled={rows.length === 1}
                    aria-label={`Remove ${r.name || "this choice"}`}
                    className="flex h-11 w-9 shrink-0 items-center justify-center rounded-xl text-subtle hover:bg-sand disabled:opacity-30"
                  >
                    <CloseIcon size={18} />
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => setRows(side, [...rows, newValueRow()])}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-clay text-sm font-bold text-clay"
          >
            <PlusIcon size={16} />
            Add another {label.toLowerCase()}
          </button>
        </div>
      ))}

      <div className="flex flex-col gap-2.5">
        <span className="text-sm font-semibold">Stock and price for each combination</span>
        {namedA.length === 0 || namedB.length === 0 ? (
          <p className="text-[13px] text-subtle">
            Name at least one {labelA.toLowerCase()} and one {labelB.toLowerCase()} above to see the combinations.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-subtle">
              Set every stock to
              <input value={fillStock} onChange={(e) => setFillStock(e.target.value)} type="number" min={0} placeholder="0" className={`${small} w-[84px]`} />
              <button type="button" onClick={fillAll} disabled={fillStock === ""} className="h-11 rounded-xl px-3 text-sm font-bold text-clay disabled:opacity-40">
                Apply
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {namedA.flatMap((a) =>
                namedB.map((b) => {
                  const cell = state.cells[cellKey(a, b)] ?? { stock: "", price: "" };
                  const name = `${a.name.trim()} / ${b.name.trim()}`;
                  return (
                    <li key={cellKey(a, b)} className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-paper p-2.5">
                      <span className="min-w-[120px] flex-1 text-[15px] font-semibold">{name}</span>
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-subtle">
                        Stock
                        <input
                          value={cell.stock}
                          onChange={(e) => setCell(a, b, { stock: e.target.value })}
                          type="number"
                          min={0}
                          placeholder="0"
                          aria-label={`Stock for ${name}`}
                          className={`${small} w-[84px]`}
                        />
                      </label>
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-subtle">
                        Price (£)
                        <input
                          value={cell.price}
                          onChange={(e) => setCell(a, b, { price: e.target.value })}
                          inputMode="decimal"
                          aria-label={`Price for ${name}`}
                          placeholder={Number(basePrice) > 0 ? Number(basePrice).toFixed(2) : "Same"}
                          className={`${small} w-[96px]`}
                        />
                      </label>
                    </li>
                  );
                })
              )}
            </ul>
            <p className="text-[13px] text-subtle">
              Leave a price blank to use the product price above.
              {vi === 0 ? ` Photos added to a ${labelA.toLowerCase()} show for every ${labelB.toLowerCase()}.` : ` Photos added to a ${labelB.toLowerCase()} show for every ${labelA.toLowerCase()}.`}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
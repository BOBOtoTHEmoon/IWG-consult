import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "sourcing-uploads";
const MAX_ITEMS = 30;
const MAX_PHOTO_BYTES = 3 * 1024 * 1024; // each photo, after it's been shrunk in the browser
const MAX_TOTAL_BYTES = 4 * 1024 * 1024; // Vercel rejects request bodies over about 4.5 MB
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const text = (fd: FormData, key: string, max = 500) => {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
};

// Saves a sourcing request (not yet paid) and returns the customer's private page link.
export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();

    // Hidden field people never fill in. Bots usually do.
    if (text(fd, "company")) return NextResponse.json({ ref: null }, { status: 200 });

    const name = text(fd, "name", 120);
    const email = text(fd, "email", 254).toLowerCase();
    const phone = text(fd, "phone", 40);
    const country = text(fd, "country", 80);
    const budget = text(fd, "budget", 40);
    const deadline = text(fd, "deadline", 10);
    const notes = text(fd, "notes", 3000);

    if (!name || !EMAIL.test(email)) {
      return NextResponse.json({ error: "Please add your name and a valid email address." }, { status: 400 });
    }
    if (!country) return NextResponse.json({ error: "Please choose where it should be delivered." }, { status: 400 });

    type Item = { name: string; quantity: number; description: string; link: string; photo?: File };
    const items: Item[] = [];
    let photoBytes = 0;
    for (let i = 0; i < MAX_ITEMS; i++) {
      if (!fd.has(`items[${i}][name]`)) break;
      const itemName = text(fd, `items[${i}][name]`, 160);
      if (!itemName) continue;
      const link = text(fd, `items[${i}][link]`, 600);
      const photo = fd.get(`items[${i}][photo]`);
      const file = photo instanceof File && photo.size > 0 ? photo : undefined;
      if (file) {
        if (!file.type.startsWith("image/")) {
          return NextResponse.json({ error: `The file for item ${i + 1} isn't a photo.` }, { status: 400 });
        }
        if (file.size > MAX_PHOTO_BYTES) {
          return NextResponse.json({ error: `The photo for item ${i + 1} is too large. Please use a smaller one.` }, { status: 413 });
        }
        photoBytes += file.size;
      }
      items.push({
        name: itemName,
        quantity: Math.max(1, Math.min(100000, Math.floor(Number(text(fd, `items[${i}][qty]`, 10)) || 1))),
        description: text(fd, `items[${i}][description]`, 2000),
        link: /^https?:\/\//i.test(link) ? link : "",
        photo: file,
      });
    }

    if (items.length === 0) return NextResponse.json({ error: "Please add at least one item to your list." }, { status: 400 });
    if (photoBytes > MAX_TOTAL_BYTES) {
      return NextResponse.json({ error: "Your photos are too large in total. Remove one or use smaller photos." }, { status: 413 });
    }

    const supabase = createAdminClient();

    // 1. Save the request.
    const { data: request, error: requestError } = await supabase
      .from("sourcing_requests")
      .insert({
        name,
        email,
        phone: phone || null,
        country,
        budget: budget || null,
        deadline: /^\d{4}-\d{2}-\d{2}$/.test(deadline) ? deadline : null,
        notes: notes || null,
      })
      .select("id, number, public_ref")
      .single();
    if (requestError || !request) {
      console.error("Sourcing request insert:", requestError?.message);
      return NextResponse.json({ error: "We couldn't save your request. Please try again." }, { status: 500 });
    }

    // 2. Upload photos, then save the items. Undo everything if any step fails.
    const uploaded: string[] = [];
    try {
      const rows = [];
      for (const [i, item] of items.entries()) {
        let imagePath: string | null = null;
        if (item.photo) {
          imagePath = `${request.number}/item-${i + 1}-${crypto.randomUUID()}.jpg`;
          const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(imagePath, Buffer.from(await item.photo.arrayBuffer()), { contentType: item.photo.type || "image/jpeg" });
          if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`);
          uploaded.push(imagePath);
        }
        rows.push({
          request_id: request.id,
          position: i,
          name: item.name,
          quantity: item.quantity,
          description: item.description || null,
          link: item.link || null,
          image_path: imagePath,
        });
      }
      const { error: itemsError } = await supabase.from("sourcing_items").insert(rows);
      if (itemsError) throw new Error(`Items insert failed: ${itemsError.message}`);
    } catch (err) {
      console.error("Sourcing request:", err);
      if (uploaded.length) await supabase.storage.from(BUCKET).remove(uploaded);
      await supabase.from("sourcing_requests").delete().eq("id", request.id);
      return NextResponse.json({ error: "We couldn't save your request. Please try again." }, { status: 500 });
    }

    // TODO (PayPal step): create the £50 PayPal order here, or on the request page.
    return NextResponse.json({ ref: request.public_ref, number: request.number });
  } catch (err) {
    console.error("Sourcing request error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
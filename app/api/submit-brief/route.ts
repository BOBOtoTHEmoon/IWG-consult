import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PACKAGE_NAMES: Record<string, string> = {
  business: "Sourcing for Business",
  home: "Home, Décor & Appliances",
  baby: "Expecting Mum",
  souvenirs: "Souvenirs & Co",
  wardrobe: "Wardrobe Package",
  unsure: "Not sure yet",
};

export async function POST(req: NextRequest) {
  try {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json(
        { error: "WEB3FORMS_ACCESS_KEY is not set on the server" },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    // Extract fields
    const fullName = (formData.get("fullName") as string) || "";
    const email = (formData.get("email") as string) || "";
    const phone = (formData.get("phone") as string) || "—";
    const company = (formData.get("company") as string) || "—";
    const packageId = (formData.get("packageId") as string) || "";
    const productDescription =
      (formData.get("productDescription") as string) || "";
    const quantity = (formData.get("quantity") as string) || "—";
    const budget = (formData.get("budget") as string) || "—";
    const timeline = (formData.get("timeline") as string) || "—";
    const deliveryCountry =
      (formData.get("deliveryCountry") as string) || "—";
    const notes = (formData.get("notes") as string) || "—";

    const packageName =
      PACKAGE_NAMES[packageId] || packageId || "Not selected";

    // Build the Web3Forms payload
    const payload = new FormData();
    payload.append("access_key", accessKey);
    payload.append("subject", `New brief: ${packageName} — ${fullName}`);
    payload.append("from_name", "Import with Goody — Brief Form");
    payload.append("replyto", email);
    payload.append("botcheck", ""); // honeypot field

    // Customer details
    payload.append("Customer Name", fullName);
    payload.append("Customer Email", email);
    payload.append("Phone", phone);
    payload.append("Company", company);

    // Package
    payload.append("Package", packageName);

    // Sourcing details
    payload.append("Product Description", productDescription);
    payload.append("Quantity", quantity);
    payload.append("Budget", budget);
    payload.append("Timeline", timeline);
    payload.append("Delivery Country", deliveryCountry);
    payload.append("Additional Notes", notes);

    // Forward any uploaded files
    const files = formData.getAll("files") as File[];
    files
      .filter((f) => f instanceof File && f.size > 0)
      .forEach((file, i) => {
        payload.append(`attachment_${i + 1}`, file, file.name);
      });

    // Send to Web3Forms
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: payload,
    });

    // Read raw response first so we can debug whatever we get
    const rawText = await res.text();
    console.log("Web3Forms HTTP status:", res.status);
    console.log("Web3Forms raw response:", rawText);

    let result: any = {};
    try {
      result = JSON.parse(rawText);
    } catch {
      // not JSON — keep raw text
    }

    if (!res.ok || !result.success) {
      console.error("Web3Forms parsed error:", result);
      return NextResponse.json(
        {
          error: result.message || `Web3Forms ${res.status}`,
          rawResponse: rawText.substring(0, 500), // first 500 chars
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit brief error:", err);
    return NextResponse.json(
      { error: "Server error", message: (err as Error).message },
      { status: 500 }
    );
  }
}
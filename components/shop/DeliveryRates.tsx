import { countryName } from "@/lib/countries";
import { gbp } from "@/lib/data";
import { getShippingSetup } from "@/lib/shipping";
import { deliveryTime, kg, type ShippingMethod } from "@/lib/shipping-types";

const priceText = (m: ShippingMethod) => {
  if (m.pricing === "flat") return m.price === 0 ? "Free" : gbp(m.price);
  let prev = 0;
  return m.weightBands
    .map((b) => {
      const text = `${prev ? `${kg(prev)} to ` : "Up to "}${kg(b.upTo)}: ${gbp(b.price)}`;
      prev = b.upTo;
      return text;
    })
    .join(", ");
};

// The delivery options Goody has set in the admin, shown on the Delivery page.
export default async function DeliveryRates() {
  const { zones, methods } = await getShippingSetup();
  const active = methods.filter((m) => m.active);
  const shown = zones.filter((z) => active.some((m) => m.zoneId === z.id));

  if (shown.length === 0) {
    return <p>Delivery options and prices are shown at checkout once you enter your address.</p>;
  }

  return (
    <>
      {shown.map((z) => (
        <div key={z.id}>
          <h3>{z.name}</h3>
          {!z.restOfWorld && z.countries.length > 1 && (
            <p className="text-sm">{z.countries.map(countryName).join(", ")}</p>
          )}
          {z.restOfWorld && <p className="text-sm">Every country not listed above.</p>}
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Usually arrives</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {active
                  .filter((m) => m.zoneId === z.id)
                  .map((m) => (
                    <tr key={m.id}>
                      <td>{m.name}</td>
                      <td>{deliveryTime(m) || "Shown at checkout"}</td>
                      <td>
                        {priceText(m)}
                        {m.freeOver != null && <> (free on orders over {gbp(m.freeOver)})</>}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <p>Some products have free delivery, and some can only be sent with certain services. Your exact options are shown at checkout.</p>
    </>
  );
}
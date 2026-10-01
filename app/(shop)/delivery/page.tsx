import Link from "next/link";
import InfoPage from "@/components/shop/InfoPage";
import { site } from "@/lib/site";

export const metadata = {
  title: "Delivery | Import with Goody",
  description: "UK and international delivery with Royal Mail. Rates, times, tracking and customs.",
};

// TODO: confirm every bracketed value with Goody before launch.
export default function DeliveryPage() {
  return (
    <InfoPage
      title="Delivery"
      intro="Every order is packed by hand and posted from the UK with Royal Mail, to UK and international addresses."
      updated={site.policiesUpdated}
    >
      <h2>Rates and times</h2>
      <p>Delivery is worked out at checkout from your address and the weight of your order.</p>
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
            <tr>
              <td>UK Standard, Royal Mail</td>
              <td>[X to Y] working days</td>
              <td>£[rate]</td>
            </tr>
            <tr>
              <td>UK Tracked, Royal Mail</td>
              <td>[X to Y] working days</td>
              <td>£[rate]</td>
            </tr>
            <tr>
              <td>International, Royal Mail</td>
              <td>[X to Y] working days, depending on the country</td>
              <td>By destination, shown at checkout</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>[Optional: Free UK Standard delivery on orders over £X.]</p>

      <h2>When your order is posted</h2>
      <p>
        Orders are packed and posted within [1 to 2] working days of payment. Orders placed at the weekend or on a
        bank holiday are posted on the next working day. You will get an email when your order is on its way.
      </p>

      <h2>Tracking</h2>
      <p>
        If you choose a tracked service, your Royal Mail tracking number is included in your dispatch email so you
        can follow your parcel to your door.
      </p>

      <h2>International orders, customs and duties</h2>
      <p>
        Orders sent outside the UK may be charged import duties, taxes or handling fees by the destination country.
        These are set by that country, are not included in our prices or delivery charges, and are paid by the
        person receiving the parcel. We recommend checking with your local customs office before ordering.
      </p>

      <h2>If your parcel has not arrived</h2>
      <p>
        Royal Mail delivery times are estimates, not guarantees. If your order has not arrived within [5] working
        days of the expected date, <Link href="/contact">contact us</Link> with your order number and we will look
        into it with Royal Mail.
      </p>

      <h2>Sourcing orders</h2>
      <p>
        Items bought through our <Link href="/sourcing">sourcing service</Link> are shipped from China, not from
        our UK stock. Shipping for these orders is quoted separately with your sourcing quote, based on the best
        route and method for your items.
      </p>
    </InfoPage>
  );
}
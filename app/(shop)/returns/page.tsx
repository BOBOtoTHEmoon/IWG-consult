import Link from "next/link";
import InfoPage from "@/components/shop/InfoPage";
import { site } from "@/lib/site";

export const metadata = {
  title: "Returns and refunds | Import with Goody",
  description: "How to return an item, your 14-day right to cancel, and what happens if something arrives faulty.",
};

// Based on UK consumer law (Consumer Contracts Regulations 2013 and Consumer Rights Act 2015).
// TODO: confirm bracketed values with Goody before launch.
export default function ReturnsPage() {
  return (
    <InfoPage
      title="Returns and refunds"
      intro="Changed your mind, or something isn't right? Here is how returns work."
      updated={site.policiesUpdated}
    >
      <h2>Changed your mind</h2>
      <p>
        You can cancel your order for any reason within <strong>14 days of receiving it</strong>. Let us know within
        that time, then send the items back within a further 14 days.
      </p>
      <ul>
        <li>Items should be unused and returned in their original packaging where possible.</li>
        <li>Return postage is paid by you, unless the item is faulty or we sent the wrong thing.</li>
        <li>
          We refund the price of the items and the standard delivery charge you paid. If you chose a faster or
          tracked service, we refund up to the cost of our standard delivery.
        </li>
        <li>
          If an item comes back used or damaged beyond what is needed to check it, we may reduce the refund to
          reflect that.
        </li>
      </ul>

      <h3>Items we can&apos;t take back</h3>
      <ul>
        <li>Items sealed for health or hygiene reasons, once the seal has been opened.</li>
        <li>Items made or personalised to your specification.</li>
      </ul>

      <h2>Faulty, damaged or wrong items</h2>
      <p>
        If something arrives faulty, damaged or not as described, <Link href="/contact">contact us</Link> within 30
        days of delivery with your order number and a photo. We will cover the return postage and offer a
        replacement or a full refund. This does not affect your legal rights.
      </p>

      <h2>How to start a return</h2>
      <ol>
        <li>
          Email <a href={`mailto:${site.email}`}>{site.email}</a> with your order number, the items you are
          returning and the reason.
        </li>
        <li>We reply with the return address and any instructions.</li>
        <li>Send the items back. We recommend a tracked service, as we can&apos;t refund parcels lost on the way to us.</li>
      </ol>

      <h2>Refunds</h2>
      <p>
        Refunds go back to your original payment method through PayPal, within 14 days of us receiving your return
        or proof that you sent it, whichever is sooner.
      </p>

      <h2>Sourcing service</h2>
      <p>
        The £50 commitment fee for our <Link href="/sourcing">sourcing service</Link> is refunded when you go
        ahead with your purchase. If you decide not to go ahead after we have sourced your items, it is not
        refunded, as it covers the sourcing work already completed. Returns on items bought through the sourcing
        service depend on the supplier and are handled case by case. [Confirm with Goody.]
      </p>
    </InfoPage>
  );
}
import Link from "next/link";
import InfoPage from "@/components/shop/InfoPage";
import { site } from "@/lib/site";

export const metadata = {
  title: "Terms and conditions | Import with Goody",
  description: "The terms for buying from our shop and using our sourcing service.",
};

// Starting template for a UK consumer shop. Have it reviewed before launch.
export default function TermsPage() {
  return (
    <InfoPage
      title="Terms and conditions"
      intro="These terms apply when you buy from our shop or use our sourcing service. Please read them before you order."
      updated={site.policiesUpdated}
    >
      <h2>1. About us</h2>
      <p>
        This website is run by {site.legalName}, {site.address}. You can contact us at{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>2. Products and prices</h2>
      <ul>
        <li>All prices are in pounds sterling (GBP) and are shown before delivery, which is added at checkout.</li>
        <li>
          We try to show every product accurately. Colours on screen can differ slightly from the real item, and
          handmade or natural materials can vary a little from piece to piece.
        </li>
        <li>If we make a clear pricing mistake, we will contact you before your order is sent and you can cancel for a full refund.</li>
      </ul>

      <h2>3. Placing an order</h2>
      <p>
        When you place an order you will get an email confirming we have received it. Our contract with you starts
        when we email to confirm your order has been dispatched. If we can&apos;t accept your order, for example
        because an item is out of stock, we will tell you and refund any payment in full.
      </p>

      <h2>4. Payment</h2>
      <p>
        Payments are taken securely through PayPal. You can pay with a PayPal account or with a debit or credit
        card through PayPal without an account. We never see or store your card details.
      </p>

      <h2>5. Delivery</h2>
      <p>
        Delivery options, times and charges are explained on our <Link href="/delivery">delivery page</Link>.
        Items are your responsibility once they are delivered to the address you gave us.
      </p>

      <h2>6. Cancellations and returns</h2>
      <p>
        You can cancel most orders within 14 days of receiving them. Full details are on our{" "}
        <Link href="/returns">returns page</Link>. Nothing in these terms affects your legal rights as a consumer.
      </p>

      <h2>7. Our sourcing service</h2>
      <ul>
        <li>
          To start a sourcing request, you pay a £50 commitment and sourcing fee. We then come back to you with
          suppliers and the full product cost, usually within 2 to 4 working days.
        </li>
        <li>
          If you go ahead with the purchase, you pay the product cost plus a service charge of 10% of the total
          product cost from China, and your £50 is refunded.
        </li>
        <li>
          If you decide not to go ahead after we have sourced your items, the £50 is not refunded, because it
          covers the sourcing work already completed.
        </li>
        <li>[If we are unable to find suitable suppliers for your request, we refund the £50 in full.] (Confirm with Goody.)</li>
        <li>
          Shipping from China is quoted separately. Supplier prices and exchange rates can change, so quotes are
          valid for [7] days.
        </li>
        <li>
          We check quantity and quality before items are shipped, choose the best shipping route for your products
          and track them until delivery. Delivery times from China are estimates.
        </li>
      </ul>

      <h2>8. The Ask Goody assistant</h2>
      <p>
        Our assistant gives automated answers to help you shop. It can make mistakes, so please check product
        details, prices and policies on the relevant page before you buy. Answers from the assistant do not change
        these terms.
      </p>

      <h2>9. Our responsibility to you</h2>
      <p>
        If we fail to meet these terms, we are responsible for loss or damage you suffer that is a foreseeable
        result of our failure. We are not responsible for loss or damage that was not foreseeable, or for business
        losses. We do not exclude or limit our liability where it would be unlawful to do so, including for death
        or personal injury caused by our negligence, for fraud, or for your legal rights as a consumer.
      </p>

      <h2>10. Law</h2>
      <p>
        These terms are governed by the law of England and Wales. If you live in Scotland or Northern Ireland, you
        can also bring proceedings in your local courts.
      </p>

      <h2>11. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The version that applies to your order is the one shown on
        this page when you placed it. See also our <Link href="/privacy">privacy policy</Link>.
      </p>
    </InfoPage>
  );
}
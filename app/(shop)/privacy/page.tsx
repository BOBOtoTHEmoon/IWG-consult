import Link from "next/link";
import InfoPage from "@/components/shop/InfoPage";
import { site } from "@/lib/site";

export const metadata = {
  title: "Privacy policy | Import with Goody",
  description: "What personal information we collect, why, who we share it with and your rights under UK GDPR.",
};

// Starting template written for UK GDPR. Have it reviewed before launch.
export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy policy"
      intro="This explains what personal information we collect when you use our website, why we need it and how we look after it."
      updated={site.policiesUpdated}
    >
      <h2>Who we are</h2>
      <p>
        {site.legalName} (&quot;we&quot;, &quot;us&quot;) runs this website and is responsible for your personal
        information. You can contact us at <a href={`mailto:${site.email}`}>{site.email}</a> or write to us at{" "}
        {site.address}.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>When you place an order:</strong> your name, email address, phone number, delivery address and
          what you ordered. Payments are handled by PayPal or Stripe. We never see or store your card details.
        </li>
        <li>
          <strong>When you send a sourcing request:</strong> your contact details, delivery country, the list of
          items you want, and any photos, links, budget or notes you choose to share.
        </li>
        <li>
          <strong>When you contact us:</strong> your name, email address and your message.
        </li>
        <li>
          <strong>When you sign up for emails:</strong> your email address.
        </li>
        <li>
          <strong>When you use the Ask Goody assistant:</strong> the messages you type, so the assistant can reply.
          Please don&apos;t share sensitive information in the chat.
        </li>
        <li>
          <strong>When you browse:</strong> basic technical information such as your IP address and browser type,
          collected by our hosting provider to keep the site secure and working.
        </li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To process, deliver and support your orders and sourcing requests (to perform our contract with you).</li>
        <li>To reply to your questions (our legitimate interest in helping customers).</li>
        <li>To send you new arrival emails, only if you have signed up (your consent, which you can withdraw at any time).</li>
        <li>To keep records for tax and accounting (a legal obligation).</li>
        <li>To keep the website secure and improve it (our legitimate interest).</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>We only share what each provider needs to do its job:</p>
      <ul>
        <li><strong>PayPal</strong> and <strong>Stripe</strong>, to take payments.</li>
        <li><strong>Royal Mail</strong>, your name and address, to deliver your order.</li>
        <li><strong>Resend</strong>, to send order and request emails.</li>
        <li><strong>Vercel</strong>, which hosts this website.</li>
        <li><strong>Supabase</strong>, which stores our order and request records.</li>
        <li><strong>[AI provider]</strong>, which powers the Ask Goody assistant.</li>
        <li>Suppliers in China, only the product details needed to fulfil a sourcing request, never your contact details unless shipping requires it.</li>
      </ul>
      <p>
        Some of these providers process data outside the UK. Where they do, they use approved safeguards such as
        the UK International Data Transfer Agreement or standard contractual clauses. We never sell your personal
        information.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Order and payment records: six years, as required for tax and accounting.</li>
        <li>Sourcing requests you don&apos;t go ahead with: [12 months], then deleted.</li>
        <li>Messages to us: as long as needed to deal with your enquiry.</li>
        <li>Email sign-ups: until you unsubscribe.</li>
      </ul>

      <h2>Cookies</h2>
            <p>
        We only use cookies and similar storage that the website needs to work, such as remembering your basket.
        We also use Vercel Analytics to count visits and see which pages are popular. It doesn&apos;t use cookies,
        doesn&apos;t identify you, and doesn&apos;t track you across other websites.
      </p>
      
      <h2>Your rights</h2>
      <p>Under UK data protection law you can ask us to:</p>
      <ul>
        <li>give you a copy of the personal information we hold about you</li>
        <li>correct anything that is wrong</li>
        <li>delete your information, where we don&apos;t need to keep it by law</li>
        <li>limit or object to how we use it</li>
        <li>send your information to you or another organisation in a usable format</li>
      </ul>
      <p>
        To use any of these rights, email <a href={`mailto:${site.email}`}>{site.email}</a>. We will reply within
        one month. If you are unhappy with how we have handled your information, you can complain to the
        Information Commissioner&apos;s Office at <a href="https://ico.org.uk" target="_blank" rel="noreferrer">ico.org.uk</a>.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy, we will update the date at the top of this page. See also our{" "}
        <Link href="/terms">terms and conditions</Link>.
      </p>
    </InfoPage>
  );
}
import type { Metadata } from "next";
import LegalShell, { LegalList, LegalQuote, type LegalSection } from "../components/marketing/LegalShell";
import { buildMetadata } from "../lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Notice · Kopahi",
  description:
    "How Kopahi (AIBA Agri NE LLP) collects, uses and protects your information when you shop or partner with us.",
  path: "/privacy",
});

const LAST_UPDATED = "April 2026";

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          Kopahi is a brand of <strong>AIBA Agri NE LLP</strong>, a Limited Liability Partnership registered in
          India with its principal place of business at Bye Lane 2, Suraj Nagar, NA Ali, Jorhat, Assam — 785001.
        </p>
        <p>
          For any privacy-related questions or to exercise your rights, write to{" "}
          <a href="mailto:inquiry@kopahi.com" className="text-(--color-gold-dark) hover:text-(--color-gold)">inquiry@kopahi.com</a>.
          Our Grievance Officer can be reached at the same address (a named officer will be listed here on request).
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "What information we collect",
    body: (
      <>
        <p>We collect three kinds of information:</p>
        <h3 className="font-display text-xl mt-6 text-(--color-ink)">Information you give us</h3>
        <LegalList
          items={[
            "Account details — name, email, phone.",
            "Order details — billing and shipping address, items purchased, gift notes.",
            "Payment details — handled by our payment partners; we never store full card numbers.",
            "Vendor onboarding — business name, state, GST number, FSSAI licence, KYC documents, payout bank/UPI details.",
            "Anything you send us — emails, contact-form messages, dispute submissions.",
          ]}
        />
        <h3 className="font-display text-xl mt-6 text-(--color-ink)">Information we collect automatically</h3>
        <LegalList
          items={[
            "Device and browser details, language, timezone, approximate location from IP.",
            "Pages viewed, products opened, search terms — to improve the experience and detect fraud.",
            "Cookies and similar technologies, as described below.",
          ]}
        />
        <h3 className="font-display text-xl mt-6 text-(--color-ink)">Information from third parties</h3>
        <LegalList
          items={[
            "Sign-in providers (Google) when you choose to log in with them.",
            "Payment gateway confirmations from our processor.",
            "Logistics partners (delivery status, returned-parcel notifications).",
          ]}
        />
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    body: (
      <>
        <p>We use what we collect to:</p>
        <LegalList
          items={[
            "Fulfil your orders and provide customer service.",
            "Onboard vendors, run KYC and process weekly payouts.",
            "Verify GI claims and protect the authenticity of listed products.",
            "Detect, prevent and respond to fraud or abuse.",
            "Send transactional emails (order, shipping, refund updates).",
            "Send marketing communications — only with your explicit consent, and you can withdraw at any time.",
            "Comply with applicable laws and respond to regulators.",
          ]}
        />
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    body: (
      <>
        <p>
          We use a small number of cookies and similar storage to keep the site working and to learn what people read.
          You can review and adjust your preferences from the cookie banner.
        </p>
        <LegalList
          items={[
            <><strong>Essential</strong> — required for login, cart, and checkout.</>,
            <><strong>Analytics</strong> — anonymised usage statistics to help us improve.</>,
            <><strong>Preferences</strong> — your settings (e.g. language, dismissed banners).</>,
            <><strong>Marketing</strong> — only if you opt in.</>,
          ]}
        />
      </>
    ),
  },
  {
    id: "how-we-share",
    title: "How we share your information",
    body: (
      <>
        <p>We share only what is necessary, and only with parties that have a clear role:</p>
        <LegalList
          items={[
            "Vendors — receive only the data they need to fulfil your order (name, shipping address, items).",
            "Logistics partners — receive shipping details to deliver your order.",
            "Payment gateways — receive payment data they need to process the transaction.",
            "Regulators and law enforcement — only when legally required.",
            "Service providers (hosting, email, analytics) — bound by contractual confidentiality.",
          ]}
        />
        <LegalQuote>
          We do not sell your personal information. We never have, and we will not.
        </LegalQuote>
      </>
    ),
  },
  {
    id: "cross-border",
    title: "Cross-border data transfers",
    body: (
      <p>
        Some of our service providers may process data outside India (e.g. cloud hosting in Singapore or the EU).
        When that happens, we use contractual protections that are at least as strong as those required by Indian law,
        and we transfer only the minimum data necessary.
      </p>
    ),
  },
  {
    id: "data-retention",
    title: "Data retention",
    body: (
      <LegalList
        items={[
          "Order records — retained for the period required by applicable tax law (typically 8 years).",
          "Vendor KYC documents — retained for the duration of the partnership plus 5 years.",
          "Marketing consents and preferences — until you withdraw consent.",
          "Browser cookies — per the durations disclosed in the cookie banner.",
        ]}
      />
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>You have the right to:</p>
        <LegalList
          items={[
            "Access the personal information we hold about you.",
            "Correct anything that is wrong or out of date.",
            "Ask us to delete data we are not legally required to keep.",
            "Withdraw consent to marketing communications at any time.",
            "Request portability of your data in a machine-readable format.",
            "Lodge a complaint with the Data Protection Board of India.",
          ]}
        />
        <p>
          To exercise any of these rights, write to{" "}
          <a href="mailto:inquiry@kopahi.com" className="text-(--color-gold-dark) hover:text-(--color-gold)">
            inquiry@kopahi.com
          </a>. We respond within 30 days.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        Kopahi is not directed at anyone under 18. We do not knowingly collect personal information from children.
        If you believe we have, please write to us and we will delete it.
      </p>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <>
        <p>
          We protect information with industry-standard practices: encryption in transit (TLS) and at rest,
          role-based access controls, audited admin actions, and regular reviews of our service providers.
        </p>
        <p>
          Vendors are responsible for keeping their own credentials safe and for the security of any data they
          export from the platform.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this notice",
    body: (
      <p>
        We may update this notice when our practices change or as required by law. When we do, we revise the
        &ldquo;Last updated&rdquo; date at the top and, for material changes, notify you by email.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <>
        <p>
          AIBA Agri NE LLP<br />
          Bye Lane 2, Suraj Nagar, NA Ali,<br />
          Jorhat, Assam — 785001
        </p>
        <p>
          Email:{" "}
          <a href="mailto:inquiry@kopahi.com" className="text-(--color-gold-dark) hover:text-(--color-gold)">
            inquiry@kopahi.com
          </a>
          <br />
          Phone: +91 91810 16660
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy"
      italicAccent="Notice."
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          Kopahi is a brand of AIBA Agri NE LLP, registered at Bye Lane 2, Suraj Nagar, NA Ali, Jorhat, Assam —
          785001. This notice explains what information we collect when you visit kopahi.com, shop with us, or
          partner with us — and how we look after it.
        </p>
      }
      sections={SECTIONS}
    />
  );
}

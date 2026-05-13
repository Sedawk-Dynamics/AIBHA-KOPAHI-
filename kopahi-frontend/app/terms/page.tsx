import type { Metadata } from "next";
import LegalShell, { LegalList, LegalQuote, type LegalSection } from "../components/marketing/LegalShell";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms governing use of kopahi.com and the Kopahi marketplace, operated by AIBA AGRI NE LLP.",
};

const LAST_UPDATED = "April 2026";

const SECTIONS: LegalSection[] = [
  {
    id: "about-kopahi",
    title: "About Kopahi",
    body: (
      <p>
        Kopahi is a multi-vendor marketplace for GI-tagged and indigenous produce, handcraft and beverages from
        Northeast India. It is operated by <strong>AIBA AGRI NE LLP</strong> from its registered office in Jorhat,
        Assam. Customers buy from us. Vendors list and sell through us. We hold the relationship together.
      </p>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility",
    body: (
      <LegalList
        items={[
          "You must be 18 years or older to use the platform.",
          "Information you provide (name, contact, address, KYC) must be accurate and current.",
          "Vendors must hold valid GST registration and FSSAI licence where applicable.",
          "We may refuse service if these conditions are not met.",
        ]}
      />
    ),
  },
  {
    id: "account-access",
    title: "Account & access",
    body: (
      <>
        <p>
          The platform supports three roles: <strong>Customer</strong>, <strong>Vendor</strong> and{" "}
          <strong>Admin</strong>. You may have one role at a time on a given account; customers can apply to upgrade
          to vendor.
        </p>
        <LegalList
          items={[
            "You are responsible for your own account and credentials.",
            "Use a strong password and do not share it. We will never ask for your password by email or phone.",
            "We may suspend an account that shows signs of fraud, abuse, or violation of these terms.",
          ]}
        />
      </>
    ),
  },
  {
    id: "buying",
    title: "Buying on Kopahi (customer terms)",
    body: (
      <>
        <LegalList
          items={[
            "Placing an order is an offer to buy. We accept the offer when we ship.",
            "Prices include applicable taxes unless otherwise stated. Shipping is calculated at checkout.",
            "We try hard to keep pricing and stock accurate. If we make a mistake, we will tell you and offer a refund or alternative.",
            "Standard shipping windows are 3–7 business days within India. Remote postcodes may take longer.",
            "You may cancel before dispatch for a full refund. After dispatch, our returns policy applies.",
            "Returns are available within 7 days of delivery for non-perishable, unopened items.",
            "For complaints, write to inquiry@kopahi.com — we acknowledge within one working day.",
          ]}
        />
      </>
    ),
  },
  {
    id: "selling",
    title: "Selling on Kopahi (vendor terms)",
    body: (
      <>
        <p>
          Vendors join Kopahi through a dedicated onboarding flow and remain in <code>pending_review</code> status
          until reviewed by our team.
        </p>
        <LegalList
          items={[
            "GI-tagged listings must be supported by valid GI documentation. We may request the original certificate.",
            "Listings are subject to discretionary approval, edits and removal where claims cannot be verified.",
            "Prices must be transparent and accurate. Bulk tiers must be honoured for the period stated.",
            "Payouts settle weekly (Monday 00:00 IST) for orders delivered the previous week, net of platform commission and taxes.",
            "Platform commission is 12% by default and is disclosed at the time of listing. We give vendors notice before any change.",
            "You must keep KYC, GST and FSSAI documents current. Documents may be re-requested for audit.",
            "Disputes are resolved per our published process; we may withhold funds during an active dispute.",
            "Suspension grounds include repeated fulfilment failures, counterfeit listings, false origin claims and abusive conduct.",
          ]}
        />
      </>
    ),
  },
  {
    id: "content-standards",
    title: "Content standards & prohibited items",
    body: (
      <LegalList
        items={[
          "No counterfeit goods, including unverified GI claims.",
          "No protected wildlife products, animal-derived items prohibited by law, or restricted substances.",
          "No misleading farmer-origin or sourcing claims.",
          "No hate speech, harassment, or unlawful content in listings, reviews or messages.",
          "We may remove non-compliant content and, in serious cases, suspend the account.",
        ]}
      />
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: (
      <>
        <p>
          The Kopahi name, logo and editorial assets are the property of AIBA AGRI NE LLP. Vendor product images and
          descriptions remain the vendor&apos;s property; by listing, vendors grant Kopahi a non-exclusive licence to
          host and display them on the platform.
        </p>
        <p>
          User submissions (reviews, questions, photos) remain yours; you grant us a non-exclusive licence to display
          them in connection with the platform.
        </p>
      </>
    ),
  },
  {
    id: "payments-taxes",
    title: "Payments & taxes",
    body: (
      <LegalList
        items={[
          "Payments are processed by our payment partners under their own terms.",
          "GST invoices are issued for every order; vendor TDS and withholding follow Indian tax law.",
          "Refunds are issued to the original payment method and may take 5–10 working days.",
        ]}
      />
    ),
  },
  {
    id: "logistics",
    title: "Logistics & delivery",
    body: (
      <>
        <p>
          We work with verified logistics partners. Perishables and certain handcraft items follow specialised
          handling.
        </p>
        <LegalList
          items={[
            "Cold-chain items require accurate, complete delivery addresses and a reachable phone number.",
            "Perishables cannot be returned for change of mind; quality-related complaints are honoured.",
            "Address inaccuracies that cause failed delivery may incur re-attempt or restocking costs.",
          ]}
        />
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers & liability",
    body: (
      <>
        <p>
          We take reasonable care to provide an accurate and reliable platform. The service is provided on an
          &ldquo;as is&rdquo; basis to the extent permitted by law.
        </p>
        <LegalQuote>
          Our total aggregate liability for any claim arising from your use of the platform is limited to the value
          of the transaction giving rise to the claim, or ₹10,000, whichever is greater.
        </LegalQuote>
      </>
    ),
  },
  {
    id: "termination",
    title: "Termination",
    body: (
      <LegalList
        items={[
          "You can close your account at any time from Account Settings.",
          "We may terminate or suspend an account for material breach of these terms, fraud or legal reasons.",
          "Outstanding orders and payouts are settled in line with the relevant policy before closure.",
        ]}
      />
    ),
  },
  {
    id: "governing-law",
    title: "Governing law & disputes",
    body: (
      <p>
        These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the
        courts in Jorhat, Assam. Before initiating legal action, please raise your concern with our Grievance
        Officer at <a className="text-(--color-gold-dark) hover:text-(--color-gold)" href="mailto:inquiry@kopahi.com">inquiry@kopahi.com</a>.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms when our service or the law changes. Material updates are notified by email and
        posted on this page; minor edits are reflected by changing the &ldquo;Last updated&rdquo; date.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <>
        <p>
          AIBA AGRI NE LLP<br />
          Bye Lane 2, Suraj Nagar, NA Ali,<br />
          Jorhat, Assam — 785001
        </p>
        <p>
          Email:{" "}
          <a href="mailto:inquiry@kopahi.com" className="text-(--color-gold-dark) hover:text-(--color-gold)">
            inquiry@kopahi.com
          </a>
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of"
      italicAccent="Use."
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          These terms govern your use of kopahi.com and the Kopahi marketplace, operated by AIBA AGRI NE LLP. By
          using the site, or buying or selling on it, you agree to what follows. If you don&apos;t, please don&apos;t
          use the platform.
        </p>
      }
      sections={SECTIONS}
    />
  );
}

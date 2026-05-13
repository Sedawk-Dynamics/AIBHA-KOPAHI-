import ComingSoon from "../../components/dashboard/ComingSoon";

export const metadata = { title: "Payouts" };

export default function PayoutsPage() {
  return (
    <ComingSoon
      eyebrow="→ Weekly settlements"
      title="Your earnings,"
      accent="paid weekly."
      body="Weekly payout ledger, gross/fees/net breakdown and statement PDFs are wiring up. Every Monday 00:00 IST."
      cta={{ href: "/dashboard", label: "Back to overview" }}
    />
  );
}

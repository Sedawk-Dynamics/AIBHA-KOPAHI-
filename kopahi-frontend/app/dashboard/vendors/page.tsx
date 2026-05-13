import ComingSoon from "../../components/dashboard/ComingSoon";

export const metadata = { title: "Vendors" };

export default function VendorsPage() {
  return (
    <ComingSoon
      eyebrow="→ Vendors"
      title="Every cooperative,"
      accent="accountable."
      body="Vendor directory with pending / approved / suspended tabs, KYC docs, payout history and a per-vendor profile is in build."
      cta={{ href: "/dashboard", label: "Back to overview" }}
    />
  );
}

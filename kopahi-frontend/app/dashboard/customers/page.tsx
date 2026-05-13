import ComingSoon from "../../components/dashboard/ComingSoon";

export const metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <ComingSoon
      eyebrow="→ Customers"
      title="The people we"
      accent="serve."
      body="A masked-PII customer directory with reveal-on-audit, lifetime spend and order history is in build."
      cta={{ href: "/dashboard", label: "Back to overview" }}
    />
  );
}

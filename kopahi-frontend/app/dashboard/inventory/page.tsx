import ComingSoon from "../../components/dashboard/ComingSoon";

export const metadata = { title: "Inventory" };

export default function InventoryPage() {
  return (
    <ComingSoon
      eyebrow="→ Inventory"
      title="Stock,"
      accent="at a glance."
      body="The inventory table — quick-restock inputs, low-stock alerts in chilli, last-restock dates — is in build."
      cta={{ href: "/dashboard", label: "Back to overview" }}
    />
  );
}

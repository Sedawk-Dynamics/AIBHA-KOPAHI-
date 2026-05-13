import ComingSoon from "../../components/dashboard/ComingSoon";

export const metadata = { title: "My Products" };

export default function VendorProductsPage() {
  return (
    <ComingSoon
      eyebrow="→ My products"
      title="Your shelf,"
      accent="curated."
      body="The vendor product manager is on the loom — listing, status filters, three-dot edit menus and the four-step Add Product wizard. We're hand-finishing the edges before it goes live."
      cta={{ href: "/add-product", label: "Add a product →" }}
    />
  );
}

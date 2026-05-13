import ComingSoon from "../../components/dashboard/ComingSoon";

export const metadata = { title: "Product Approvals" };

export default function ApprovalsPage() {
  return (
    <ComingSoon
      eyebrow="→ Product approvals"
      title="Editorial"
      accent="review."
      body="The two-pane approvals queue — vendor submissions on the left, an editorial preview of how the product will appear publicly on the right, with Approve · Request Changes · Reject actions — is in build."
      cta={{ href: "/dashboard", label: "Back to overview" }}
    />
  );
}

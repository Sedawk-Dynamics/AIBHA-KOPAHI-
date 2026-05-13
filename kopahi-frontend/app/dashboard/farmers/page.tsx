import ComingSoon from "../../components/dashboard/ComingSoon";

export const metadata = { title: "Farmers Directory" };

export default function AdminFarmersPage() {
  return (
    <ComingSoon
      eyebrow="→ Farmers directory"
      title="Every name,"
      accent="documented."
      body="The canonical farmer directory — admin CRUD over the network of growers and weavers vendors link to — is in build. The public view already lives at /farmers."
      cta={{ href: "/farmers", label: "View public directory →" }}
    />
  );
}

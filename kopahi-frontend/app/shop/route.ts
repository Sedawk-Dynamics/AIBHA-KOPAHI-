import { redirect } from "next/navigation";

export const dynamic = "force-static";

// Shop lives on kopahi.com itself. Keep the /shop alias so any old link or
// printed CTA still resolves — point it at the catalog.
export function GET() {
  redirect("/products");
}

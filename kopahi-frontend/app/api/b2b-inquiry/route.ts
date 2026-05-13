import { NextResponse } from "next/server";

type Payload = {
  fullName?: string;
  email?: string;
  phone?: string;
  company?: string;
  country?: string;
  products?: string[];
  volume?: string;
  message?: string;
  referredProduct?: string | null;
};

function bad(msg: string) {
  return NextResponse.json({ ok: false, error: msg }, { status: 400 });
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return bad("Invalid JSON");
  }

  const { fullName, email, phone, company, country, volume, message } = body;
  if (!fullName || !email || !phone || !company || !country || !volume || !message) {
    return bad("Missing required fields");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Invalid email");
  if (message.length < 10) return bad("Message too short");

  // Routes to partner@kopahi.com and sales@kopahi.com per the brief. Plug in
  // Resend / SMTP here when credentials are provisioned.
  console.info("[b2b-inquiry] routed to partner@kopahi.com, sales@kopahi.com", {
    fullName,
    email,
    phone,
    company,
    country,
    products: body.products,
    volume,
    referredProduct: body.referredProduct,
    message: message.slice(0, 280),
  });

  return NextResponse.json({ ok: true, routedTo: ["partner@kopahi.com", "sales@kopahi.com"] });
}

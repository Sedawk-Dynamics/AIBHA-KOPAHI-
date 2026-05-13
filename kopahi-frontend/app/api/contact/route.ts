import { NextResponse } from "next/server";

const INQUIRY_ROUTES: Record<string, string> = {
  general: "inquiry@kopahi.com",
  sales: "sales@kopahi.com",
  partner: "partner@kopahi.com",
  export: "partner@kopahi.com",
  sourcing: "trideep@kopahi.com",
};

type Payload = {
  type?: keyof typeof INQUIRY_ROUTES | string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
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

  const { type, name, email, phone, message } = body;
  if (!name || !email || !message) return bad("Missing required fields");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Invalid email");
  if (message.length < 10) return bad("Message too short");

  const routeTo = (type && INQUIRY_ROUTES[type as keyof typeof INQUIRY_ROUTES]) ?? INQUIRY_ROUTES.general;

  // The brief asks for SMTP / Resend / Formspree. We log here and stub a
  // success so the form is usable end-to-end. Wire the actual transport
  // (Resend recommended) in this file when credentials are provisioned.
  console.info("[contact] inquiry routed to", routeTo, {
    type,
    name,
    email,
    phone,
    message: message.slice(0, 240),
  });

  return NextResponse.json({ ok: true, routedTo: routeTo });
}

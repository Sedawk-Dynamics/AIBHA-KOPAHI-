import { NextResponse } from "next/server";

/* Relays B2B inquiries into Webelio CRM (Perfex-style web-to-lead form).
   Flow: GET the form page to obtain the CSRF token + session cookie, then
   POST the mapped fields with that token. The site keeps its own styled
   form; the CRM receives every submission as a lead. */

const WTL_URL =
  "https://crm.kopahi.com/forms/wtl/2417f7b65e2ad073abd1d91f385ee098";

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

/** Extract the value="" of an <input> whose attributes include name="<field>". */
function inputValue(html: string, field: string): string | null {
  const tag = html.match(new RegExp(`<input[^>]*name="${field}"[^>]*>`, "i"))?.[0];
  if (!tag) return null;
  return tag.match(/value="([^"]*)"/i)?.[1] ?? null;
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

  try {
    // 1. Fetch the form page: CSRF token + session cookie.
    const formPage = await fetch(WTL_URL, { cache: "no-store" });
    if (!formPage.ok) throw new Error(`CRM form page ${formPage.status}`);
    const html = await formPage.text();

    const csrf = inputValue(html, "csrf_token_name");
    const key = inputValue(html, "key");
    if (!csrf || !key) throw new Error("CRM form fields not found");

    const cookies = formPage.headers
      .getSetCookie()
      .map((c) => c.split(";")[0])
      .join("; ");

    // 2. Compose the lead description from the fields the CRM form lacks.
    const description = [
      body.referredProduct ? `Referred product: ${body.referredProduct}` : null,
      body.products?.length ? `Required products: ${body.products.join(", ")}` : null,
      `Estimated monthly volume: ${volume}`,
      "",
      message,
    ]
      .filter((l) => l !== null)
      .join("\n");

    // 3. Submit to the CRM.
    const form = new URLSearchParams({
      csrf_token_name: csrf,
      key,
      name: fullName,
      email,
      phonenumber: phone,
      company,
      address: country,
      description,
      accept_terms_and_conditions: "1",
    });

    const submit = await fetch(WTL_URL, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        cookie: cookies,
        referer: WTL_URL,
      },
      body: form.toString(),
      redirect: "follow",
      cache: "no-store",
    });

    const result = await submit.text();
    if (!submit.ok || /not allowed|csrf/i.test(result.slice(0, 2000))) {
      throw new Error(`CRM rejected submission (${submit.status})`);
    }

    return NextResponse.json({ ok: true, routedTo: ["crm.kopahi.com"] });
  } catch (err) {
    console.error("[b2b-inquiry] CRM relay failed:", err);
    return NextResponse.json(
      { ok: false, error: "CRM unreachable" },
      { status: 502 }
    );
  }
}

"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const PRODUCT_CATS = [
  "Tea (Assam Range)",
  "GI Spices (Turmeric / Naga Chilli / Ginger)",
  "Vegetable Powders (Tomato / Beetroot / Carrot)",
  "Herbal Powders (Curry Leaf / Mint / Moringa)",
  "GI Rice (Keteki Joha)",
  "GI Fruits (Tripura Pineapple)",
  "Specialty (Bhoot Jolokia Jam)",
  "Mixed catalogue",
];

const VOLUMES = ["<100kg", "100kg – 500kg", "500kg – 2T", "2T+"];

type Errors = Partial<Record<"fullName" | "email" | "phone" | "company" | "country" | "volume" | "message", string>>;

export default function B2BInquiryForm() {
  const sp = useSearchParams();
  const presetProduct = sp.get("product");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [selected, setSelected] = useState<string[]>(
    presetProduct ? ["Mixed catalogue"] : []
  );
  const [volume, setVolume] = useState("");
  const [message, setMessage] = useState(
    presetProduct ? `I would like a quote for "${presetProduct}".\n\n` : ""
  );
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const toggleChip = (chip: string) =>
    setSelected((p) => (p.includes(chip) ? p.filter((c) => c !== chip) : [...p, chip]));

  const validate = (): Errors => {
    const e: Errors = {};
    if (!fullName.trim()) e.fullName = "Please share your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "A valid business email helps us route you.";
    if (!phone.trim()) e.phone = "Phone helps us turn this around fast.";
    if (!company.trim()) e.company = "Company name, please.";
    if (!country.trim()) e.country = "Country or region, please.";
    if (!volume) e.volume = "Pick the closest volume bracket.";
    if (message.trim().length < 10) e.message = "A sentence or two — what do you need?";
    return e;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) {
      setStatus("error");
      setServerMessage("");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/b2b-inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          company,
          country,
          products: selected,
          volume,
          message,
          referredProduct: presetProduct ?? null,
        }),
      });
      if (!res.ok) throw new Error("Network");
      setStatus("success");
    } catch {
      setStatus("error");
      setServerMessage("We couldn't reach our inbox. Please email partner@kopahi.com directly.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-(--color-ivory) border border-(--color-bamboo)/25 p-10 sm:p-12">
        <div className="flex justify-center mb-8" aria-hidden="true">
          <svg viewBox="0 0 240 24" className="organic-divider w-40">
            <path
              d="M2 12 C 30 4, 60 22, 90 12 S 150 2, 180 14 S 220 18, 238 10"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="120" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <p className="eyebrow text-center">Inquiry received</p>
        <h3 className="mt-5 font-display font-light text-3xl sm:text-4xl text-(--color-ink) text-center leading-tight">
          Thank you. We&apos;ll be in touch within <span className="accent-italic">24 hours.</span>
        </h3>
        <p className="mt-6 text-center text-(--color-ink)/70 max-w-md mx-auto">
          A note has been routed to <span className="text-(--color-moss)">partner@kopahi.com</span> and{" "}
          <span className="text-(--color-moss)">sales@kopahi.com</span>. If your timeline is tight, write to us directly.
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      <p className="eyebrow text-(--color-bamboo)">→ Tell us about your business</p>
      <Field id="fullName" label="Full name" error={errors.fullName}>
        <input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          className="kp-input"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field id="email" label="Business email" error={errors.email}>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="kp-input" />
        </Field>
        <Field id="phone" label="Phone" error={errors.phone}>
          <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className="kp-input" />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field id="company" label="Company name" error={errors.company}>
          <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" className="kp-input" />
        </Field>
        <Field id="country" label="Country / Region" error={errors.country}>
          <input id="country" value={country} onChange={(e) => setCountry(e.target.value)} autoComplete="country-name" className="kp-input" />
        </Field>
      </div>

      <fieldset>
        <legend className="eyebrow mb-3">Required products</legend>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_CATS.map((c) => {
            const active = selected.includes(c);
            return (
              <button
                type="button"
                key={c}
                onClick={() => toggleChip(c)}
                aria-pressed={active}
                className={`px-4 py-2 text-sm transition-colors border ${
                  active
                    ? "bg-(--color-gold) text-(--color-moss-dark) border-(--color-gold)"
                    : "bg-transparent text-(--color-ink)/75 border-(--color-bamboo)/40 hover:border-(--color-gold)"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Field id="volume" label="Estimated monthly volume" error={errors.volume}>
        <select id="volume" value={volume} onChange={(e) => setVolume(e.target.value)} className="kp-input">
          <option value="">Pick a bracket</option>
          {VOLUMES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Message / notes" error={errors.message}>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="kp-input resize-none"
          placeholder="A line about your timeline, target market, sample needs."
        />
      </Field>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full inline-flex items-center justify-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Submit Inquiry"} <span aria-hidden="true">→</span>
      </button>

      <p className="text-xs italic text-(--color-ink)/55">
        By submitting, you agree to our terms. We never share your data.
      </p>

      {status === "error" && (
        <p role="alert" className="text-sm text-(--color-chilli)">
          {serverMessage || "Please check the highlighted fields."}
        </p>
      )}

      <style jsx>{`
        :global(.kp-input) {
          width: 100%;
          background: transparent;
          border-bottom: 1px solid color-mix(in srgb, var(--color-bamboo) 45%, transparent);
          padding: 0.75rem 0;
          color: var(--color-ink);
          outline: none;
          transition: border-color 0.2s;
        }
        :global(.kp-input:focus) {
          border-color: var(--color-gold);
        }
      `}</style>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block eyebrow mb-2">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-(--color-gold-dark)">{error}</p>}
    </div>
  );
}

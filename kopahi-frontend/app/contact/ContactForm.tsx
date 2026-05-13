"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

type InquiryType = "general" | "sales" | "partner" | "export" | "sourcing";

const INQUIRY_OPTIONS: { value: InquiryType; label: string; routes: string }[] = [
  { value: "general", label: "General inquiry", routes: "inquiry@kopahi.com" },
  { value: "sales", label: "Sales", routes: "sales@kopahi.com" },
  { value: "partner", label: "Partner / stockist", routes: "partner@kopahi.com" },
  { value: "export", label: "Export inquiry", routes: "partner@kopahi.com" },
  { value: "sourcing", label: "Sourcing & operations", routes: "trideep@kopahi.com" },
];

type Errors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

export default function ContactForm() {
  const sp = useSearchParams();
  const presetType = sp.get("type") as InquiryType | null;
  const presetProduct = sp.get("product");

  const [type, setType] = useState<InquiryType>(
    INQUIRY_OPTIONS.find((o) => o.value === presetType)?.value ?? "general"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(presetProduct ? `I would like to inquire about "${presetProduct}".\n\n` : "");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const validate = (): Errors => {
    const e: Errors = {};
    if (!name.trim()) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Please enter a valid email.";
    if (phone && !/^[+\d\s\-()]{6,}$/.test(phone.trim())) e.phone = "Please check the phone number.";
    if (message.trim().length < 10) e.message = "A sentence or two will do.";
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type, name, email, phone, message }),
      });
      if (!res.ok) throw new Error("Network");
      setStatus("success");
      setServerMessage("Thank you — we will be in touch.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setStatus("error");
      setServerMessage("We couldn't send that just now. Please email us directly.");
    }
  };

  const routeEmail = INQUIRY_OPTIONS.find((o) => o.value === type)?.routes ?? "inquiry@kopahi.com";

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6" aria-describedby="contact-status">
      <FormField id="type" label="Inquiry type">
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as InquiryType)}
          className="w-full bg-transparent border-b border-(--color-bamboo)/40 focus:border-(--color-gold) outline-none py-3 text-(--color-ink)"
        >
          {INQUIRY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-(--color-ink)/55">Routes to {routeEmail}</p>
      </FormField>

      <FormField id="name" label="Your name" error={errors.name}>
        <input
          id="name"
          type="text"
          value={name}
          autoComplete="name"
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setErrors((p) => ({ ...p, name: validate().name }))}
          className="w-full bg-transparent border-b border-(--color-bamboo)/40 focus:border-(--color-gold) outline-none py-3 text-(--color-ink) placeholder:text-(--color-ink)/40"
          placeholder="Your full name"
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField id="email" label="Email" error={errors.email}>
          <input
            id="email"
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setErrors((p) => ({ ...p, email: validate().email }))}
            className="w-full bg-transparent border-b border-(--color-bamboo)/40 focus:border-(--color-gold) outline-none py-3 text-(--color-ink) placeholder:text-(--color-ink)/40"
            placeholder="you@example.com"
          />
        </FormField>
        <FormField id="phone" label="Phone (optional)" error={errors.phone}>
          <input
            id="phone"
            type="tel"
            value={phone}
            autoComplete="tel"
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => setErrors((p) => ({ ...p, phone: validate().phone }))}
            className="w-full bg-transparent border-b border-(--color-bamboo)/40 focus:border-(--color-gold) outline-none py-3 text-(--color-ink) placeholder:text-(--color-ink)/40"
            placeholder="+91 …"
          />
        </FormField>
      </div>

      <FormField id="message" label="Your message" error={errors.message}>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={() => setErrors((p) => ({ ...p, message: validate().message }))}
          className="w-full bg-transparent border-b border-(--color-bamboo)/40 focus:border-(--color-gold) outline-none py-3 text-(--color-ink) placeholder:text-(--color-ink)/40 resize-none"
          placeholder="A sentence is fine. Two is generous."
        />
      </FormField>

      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="inline-flex items-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : status === "success" ? "Thank you" : "Send"}
        {status !== "loading" && status !== "success" && <span aria-hidden="true">→</span>}
      </button>

      <p
        id="contact-status"
        role="status"
        aria-live="polite"
        className={`text-sm min-h-[1.25rem] ${
          status === "success"
            ? "text-(--color-moss)"
            : status === "error" && serverMessage
            ? "text-(--color-chilli)"
            : "text-(--color-ink)/55"
        }`}
      >
        {serverMessage || (Object.keys(errors).length ? "Please check the highlighted fields." : " ")}
      </p>
    </form>
  );
}

function FormField({
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

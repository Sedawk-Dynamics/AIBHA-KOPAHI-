"use client";

import { useEffect, useState } from "react";
import EditorialShell from "../../components/dashboard/EditorialShell";
import { DashCard } from "../../components/dashboard/DashPrimitives";
import { useAuth } from "../../context/AuthContext";

export default function AccountPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    dob: "",
    gender: "",
  });
  const [prefs, setPrefs] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    smsAlerts: true,
  });
  const [original, setOriginal] = useState({ profile, prefs });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [twoFA, setTwoFA] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    // user is hydrated asynchronously from /api/auth/me; the standard pattern
    // is to seed the form once the user lands.
    if (user) {
      const fresh = { name: user.name ?? "", email: user.email ?? "", phone: "", dob: "", gender: "" };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile(fresh);
      setOriginal((o) => ({ ...o, profile: fresh }));
    }
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(t);
  }, [toast]);

  const hasChanges = JSON.stringify({ profile, prefs }) !== JSON.stringify(original);

  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      setOriginal({ profile, prefs });
      setSaving(false);
      setToast("Changes saved.");
    }, 600);
  };

  return (
    <EditorialShell
      eyebrow="→ Account settings"
      title={
        <>
          Your details, <span className="accent-italic">remembered.</span>
        </>
      }
      actions={
        hasChanges ? (
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-3 bg-(--color-gold) text-(--color-moss-dark) text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        ) : null
      }
    >
      {toast && (
        <div role="status" className="mb-8 border border-(--color-gold)/40 bg-(--color-gold)/10 px-5 py-4 text-sm text-(--color-moss)">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashCard title="Profile">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field id="name" label="Full name">
                <input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="kp-input"
                />
              </Field>
              <Field id="email" label="Email">
                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="kp-input"
                />
              </Field>
              <Field id="phone" label="Phone">
                <input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="kp-input"
                />
              </Field>
              <Field id="dob" label="Date of birth">
                <input
                  id="dob"
                  type="date"
                  value={profile.dob}
                  onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                  className="kp-input"
                />
              </Field>
            </div>
          </DashCard>

          <DashCard title="Communication preferences">
            <ul className="divide-y divide-(--color-bamboo)/15">
              {(
                [
                  { key: "orderUpdates", label: "Order updates", body: "Shipping, tracking, delivery confirmations." },
                  { key: "promotions", label: "Seasonal promotions", body: "Occasional notes when a new origin lands or a flush is ready." },
                  { key: "newsletter", label: "The Kopahi Journal", body: "Slow writing about heritage, recipes, and the people we work with." },
                  { key: "smsAlerts", label: "SMS alerts", body: "Critical-only — delivery windows and OTPs." },
                ] as { key: keyof typeof prefs; label: string; body: string }[]
              ).map((p) => (
                <li key={p.key} className="py-4 flex items-start justify-between gap-6">
                  <div>
                    <p className="font-display text-(--color-ink)">{p.label}</p>
                    <p className="text-sm text-(--color-ink)/65 mt-1 max-w-md leading-relaxed">{p.body}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrefs((cur) => ({ ...cur, [p.key]: !cur[p.key] }))}
                    aria-pressed={prefs[p.key]}
                    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
                      prefs[p.key] ? "bg-(--color-gold)" : "bg-(--color-bamboo)/30"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-(--color-ivory) shadow transition-transform ${
                        prefs[p.key] ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </DashCard>

          <DashCard title="Security">
            <div className="space-y-5">
              <a
                href="/forgot-password"
                className="block py-3 border-b border-(--color-bamboo)/20 text-(--color-ink) hover:text-(--color-moss) transition-colors"
              >
                <span className="font-display">Change password</span>
                <span className="float-right text-xs uppercase tracking-[0.22em] text-(--color-gold-dark) mt-0.5">Update →</span>
              </a>
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-display text-(--color-ink)">Two-factor authentication</p>
                  <p className="text-sm text-(--color-ink)/65 mt-1 max-w-md leading-relaxed">
                    Adds a one-time code at sign-in, on top of your password.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFA((v) => !v)}
                  aria-pressed={twoFA}
                  className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
                    twoFA ? "bg-(--color-gold)" : "bg-(--color-bamboo)/30"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-(--color-ivory) shadow transition-transform ${
                      twoFA ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </DashCard>
        </div>

        <aside className="space-y-6">
          <DashCard title="Loyalty">
            <p className="font-display text-3xl text-(--color-moss)">1,245 pts</p>
            <p className="mt-2 text-sm text-(--color-ink)/65">
              Each point is a rupee toward your next basket. Earned on every delivered order.
            </p>
          </DashCard>

          <DashCard title="Danger zone">
            <p className="text-sm text-(--color-ink)/70 leading-relaxed">
              Closing your account removes your profile, addresses, and saved origins. Order history is retained per
              our retention policy.
            </p>
            <label htmlFor="confirm" className="block mt-5 eyebrow mb-2">
              Type <span className="font-display italic text-(--color-chilli)">delete</span> to confirm
            </label>
            <input
              id="confirm"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="delete"
              className="kp-input"
            />
            <button
              type="button"
              disabled={deleteConfirm !== "delete"}
              className="mt-5 w-full inline-flex items-center justify-center gap-3 px-6 py-3 border border-(--color-chilli)/50 text-(--color-chilli) text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-chilli) hover:text-(--color-ivory) transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Close account
            </button>
          </DashCard>
        </aside>
      </div>

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
    </EditorialShell>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block eyebrow mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

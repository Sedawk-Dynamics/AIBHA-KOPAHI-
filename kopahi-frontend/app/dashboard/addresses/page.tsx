"use client";

import { useState } from "react";
import EditorialShell from "../../components/dashboard/EditorialShell";
import { DashCard } from "../../components/dashboard/DashPrimitives";

type Address = {
  id: number;
  label: "Home" | "Work" | "Other";
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
};

const SEED: Address[] = [
  {
    id: 1,
    label: "Home",
    name: "Rahul Sharma",
    line1: "Flat 12B, Lotus Residency",
    line2: "Indiranagar 2nd Stage",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    phone: "+91 98765 43210",
    isDefault: true,
  },
  {
    id: 2,
    label: "Work",
    name: "Rahul Sharma",
    line1: "5th Floor, Prestige Tower",
    line2: "MG Road",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    phone: "+91 98765 43210",
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(SEED);
  const [editing, setEditing] = useState<Address | null>(null);
  const [adding, setAdding] = useState(false);

  const setDefault = (id: number) =>
    setAddresses((cur) => cur.map((a) => ({ ...a, isDefault: a.id === id })));

  const remove = (id: number) => setAddresses((cur) => cur.filter((a) => a.id !== id));

  return (
    <EditorialShell
      eyebrow="→ Addresses"
      title={
        <>
          Where we send your <span className="accent-italic">parcels.</span>
        </>
      }
      actions={
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setAdding(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 bg-(--color-gold) text-(--color-moss-dark) text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
        >
          + Add address
        </button>
      }
    >
      {addresses.length === 0 ? (
        <DashCard>
          <div className="py-12 text-center">
            <p className="font-display italic text-xl text-(--color-bamboo)">
              No addresses yet.
            </p>
            <p className="mt-3 text-sm text-(--color-ink)/65 max-w-md mx-auto">
              Add a delivery address to make checkout faster.
            </p>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-(--color-gold) text-(--color-moss-dark) text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
            >
              Add first address →
            </button>
          </div>
        </DashCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((a) => (
            <article
              key={a.id}
              className="rounded-[2px] border border-(--color-bamboo)/25 bg-(--color-ivory-warm) p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow text-(--color-bamboo)">→ {a.label}</p>
                  <h3 className="mt-2 font-display text-xl text-(--color-ink)">{a.name}</h3>
                </div>
                {a.isDefault && (
                  <span className="px-3 py-1 text-[10px] uppercase tracking-[0.22em] bg-(--color-gold)/15 text-(--color-gold-dark)">
                    Default
                  </span>
                )}
              </div>
              <address className="mt-4 not-italic text-sm text-(--color-ink)/80 leading-relaxed">
                {a.line1}
                {a.line2 ? <><br />{a.line2}</> : null}
                <br />
                {a.city}, {a.state} — {a.pincode}
                <br />
                <span className="text-(--color-bamboo)">{a.phone}</span>
              </address>
              <div className="mt-6 flex flex-wrap items-center gap-3 pt-5 border-t border-(--color-bamboo)/15">
                <button
                  type="button"
                  onClick={() => setEditing(a)}
                  className="text-xs uppercase tracking-[0.22em] text-(--color-gold-dark) hover:text-(--color-gold)"
                >
                  Edit
                </button>
                {!a.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefault(a.id)}
                    className="text-xs uppercase tracking-[0.22em] text-(--color-ink)/70 hover:text-(--color-moss)"
                  >
                    Make default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  className="font-display italic text-sm text-(--color-bamboo) hover:text-(--color-chilli) transition-colors ml-auto"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {(adding || editing) && (
        <AddressDrawer
          initial={editing}
          onClose={() => {
            setAdding(false);
            setEditing(null);
          }}
          onSave={(addr) => {
            if (editing) {
              setAddresses((cur) => cur.map((a) => (a.id === editing.id ? { ...addr, id: editing.id } : a)));
            } else {
              const id = Math.max(0, ...addresses.map((a) => a.id)) + 1;
              setAddresses((cur) => [...cur, { ...addr, id }]);
            }
            setAdding(false);
            setEditing(null);
          }}
        />
      )}
    </EditorialShell>
  );
}

function AddressDrawer({
  initial,
  onClose,
  onSave,
}: {
  initial: Address | null;
  onClose: () => void;
  onSave: (a: Omit<Address, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Address, "id">>(
    initial
      ? { ...initial }
      : {
          label: "Home",
          name: "",
          line1: "",
          line2: "",
          city: "",
          state: "",
          pincode: "",
          phone: "",
          isDefault: false,
        }
  );

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div onClick={onClose} aria-hidden="true" className="absolute inset-0 bg-(--color-moss-dark)/40" />
      <aside className="relative w-full sm:w-[480px] h-full bg-(--color-ivory) overflow-y-auto">
        <header className="px-8 py-6 flex items-center justify-between border-b border-(--color-bamboo)/20">
          <div>
            <p className="eyebrow">→ {initial ? "Edit address" : "New address"}</p>
            <h2 className="mt-2 font-display text-2xl text-(--color-ink)">Delivery details</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-(--color-bamboo)/30 text-(--color-ink) hover:border-(--color-gold)"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          <Field id="label" label="Label">
            <select
              id="label"
              value={form.label}
              onChange={(e) => set("label", e.target.value as Address["label"])}
              className="kp-input"
            >
              <option>Home</option>
              <option>Work</option>
              <option>Other</option>
            </select>
          </Field>
          <Field id="name" label="Full name">
            <input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} className="kp-input" required />
          </Field>
          <Field id="line1" label="Address line 1">
            <input id="line1" value={form.line1} onChange={(e) => set("line1", e.target.value)} className="kp-input" required />
          </Field>
          <Field id="line2" label="Address line 2 (optional)">
            <input id="line2" value={form.line2 ?? ""} onChange={(e) => set("line2", e.target.value)} className="kp-input" />
          </Field>
          <div className="grid grid-cols-2 gap-6">
            <Field id="city" label="City">
              <input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} className="kp-input" required />
            </Field>
            <Field id="state" label="State">
              <input id="state" value={form.state} onChange={(e) => set("state", e.target.value)} className="kp-input" required />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Field id="pincode" label="Pincode">
              <input id="pincode" value={form.pincode} onChange={(e) => set("pincode", e.target.value)} className="kp-input" required />
            </Field>
            <Field id="phone" label="Phone">
              <input id="phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="kp-input" required />
            </Field>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <span
              className={`inline-block h-4 w-4 border ${
                form.isDefault ? "bg-(--color-gold) border-(--color-gold)" : "border-(--color-bamboo)/40"
              }`}
              aria-hidden="true"
            />
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => set("isDefault", e.target.checked)}
              className="sr-only"
            />
            <span className="text-sm text-(--color-ink)/80">Set as default delivery address</span>
          </label>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
          >
            {initial ? "Save changes" : "Save address"}
          </button>
        </form>

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
      </aside>
    </div>
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

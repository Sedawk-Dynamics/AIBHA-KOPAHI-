"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { CART_OPEN_EVENT } from "../../components/marketing/CartDrawer";

type Props = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price?: number;
  category?: string;
};

export default function ProductCTAs({ productId, slug, name, image, price, category }: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add({
      productId,
      name,
      image,
      // The marketing catalog doesn't carry retail prices yet; default to 0
      // so the cart context still accepts the item. Pricing is set when the
      // SKU is fully wired from the vendor side.
      price: typeof price === "number" ? price : 0,
      category,
      quantity: 1,
    });
    setAdded(true);
    window.dispatchEvent(new Event(CART_OPEN_EVENT));
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section className="mt-14 flex flex-wrap gap-4">
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 4h2l2.5 11h11L21 7H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="20" r="1.4" fill="currentColor" />
          <circle cx="17" cy="20" r="1.4" fill="currentColor" />
        </svg>
        {added ? "Added to basket" : "Add to cart"}
        {!added && <span aria-hidden="true">→</span>}
      </button>
      <Link
        href={`/b2b?product=${slug}#quote`}
        className="inline-flex items-center gap-3 px-7 py-4 border border-(--color-moss)/60 text-(--color-moss) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-moss) hover:text-(--color-ivory) transition-colors"
      >
        Inquire For Bulk / Export
      </Link>
    </section>
  );
}

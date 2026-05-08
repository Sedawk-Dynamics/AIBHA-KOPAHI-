"use client";

const categoryHue: Record<string, string> = {
  Spotlight: "92400e/fef3c7",
  Recipes: "9a3412/fed7aa",
  "Field Notes": "166534/dcfce7",
  "Inside Kopahi": "14532d/86efac",
};

export default function BlogImage({
  src,
  alt,
  category,
  className,
  fallbackText,
}: {
  src: string;
  alt: string;
  category?: string;
  className?: string;
  fallbackText?: string;
}) {
  const palette = (category && categoryHue[category]) || "14532d/86efac";
  const text = fallbackText ?? alt;
  const fallback = `https://placehold.co/1400x900/${palette}?text=${encodeURIComponent(text)}`;

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        const t = e.currentTarget;
        if (!t.dataset.fallback) {
          t.dataset.fallback = "1";
          t.src = fallback;
        }
      }}
      className={className}
    />
  );
}

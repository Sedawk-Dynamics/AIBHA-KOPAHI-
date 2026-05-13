export default function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-(--color-bamboo)/25 py-6 bg-(--color-ivory)">
      <div className="marquee-track flex items-center gap-12 whitespace-nowrap">
        {doubled.map((word, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="font-display italic text-[clamp(1.25rem,2.4vw,2rem)] text-(--color-moss)">
              {word}
            </span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="text-(--color-gold) shrink-0"
            >
              <path
                d="M12 3c0 6 3 9 9 9-6 0-9 3-9 9 0-6-3-9-9-9 6 0 9-3 9-9z"
                fill="currentColor"
              />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

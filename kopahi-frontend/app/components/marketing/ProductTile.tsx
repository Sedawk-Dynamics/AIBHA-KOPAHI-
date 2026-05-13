import Image from "next/image";
import Link from "next/link";

export default function ProductTile({
  name,
  origin,
  image,
  gi = false,
  href = "/products",
}: {
  name: string;
  origin: string;
  image: string;
  gi?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="group block w-[260px] sm:w-[300px] shrink-0 relative"
    >
      <div className="relative aspect-square overflow-hidden rounded-sm bg-(--color-ivory-warm)">
        <Image
          src={image}
          alt={name}
          fill
          sizes="300px"
          className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
        />
        {gi && (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-(--color-ivory)/95 text-(--color-moss) text-[10px] uppercase tracking-[0.2em] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-gold)" /> GI Tagged
          </span>
        )}
        <div className="absolute inset-0 bg-(--color-moss)/0 group-hover:bg-(--color-moss)/30 transition-colors duration-500 flex items-end justify-center pb-5">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-(--color-ivory) text-xs uppercase tracking-[0.22em]">
            View Story →
          </span>
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-display text-lg sm:text-xl text-(--color-ink)">{name}</h4>
        <p className="font-display italic text-sm text-(--color-bamboo) mt-1">{origin}</p>
      </div>
    </Link>
  );
}

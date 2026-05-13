import Image from "next/image";

export default function FounderCard({
  name,
  role,
  email,
  quote,
  bio,
  image,
}: {
  name: string;
  role: string;
  email?: string;
  quote: string;
  bio: string;
  image?: string;
}) {
  return (
    <article className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 items-start">
      <div className="sm:col-span-5 relative aspect-[4/5] overflow-hidden rounded-sm bg-(--color-ivory-warm)">
        {image ? (
          <Image
            src={image}
            alt={`Portrait of ${name}`}
            fill
            sizes="(max-width: 640px) 100vw, 40vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-(--color-bamboo) font-display text-6xl italic">
            {name
              .split(" ")
              .map((p) => p[0])
              .join("")}
          </div>
        )}
      </div>
      <div className="sm:col-span-7">
        <p className="eyebrow">{role}</p>
        <h3 className="font-display text-3xl sm:text-4xl text-(--color-ink) mt-2">
          {name}
        </h3>
        <p className="font-display italic text-(--color-bamboo) text-lg sm:text-xl mt-5 leading-snug">
          “{quote}”
        </p>
        <p className="text-(--color-ink)/75 leading-relaxed mt-5 max-w-prose">{bio}</p>
        {email && (
          <a
            href={`mailto:${email}`}
            className="mt-5 inline-block text-(--color-gold-dark) hover:text-(--color-gold) text-sm uppercase tracking-[0.18em]"
          >
            {email}
          </a>
        )}
      </div>
    </article>
  );
}

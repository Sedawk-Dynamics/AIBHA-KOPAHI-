import type { Block } from "./posts";
import BlogImage from "./BlogImage";

export default function PostBody({ blocks, category }: { blocks: Block[]; category?: string }) {
  return (
    <div className="max-w-3xl mx-auto">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mt-12 mb-4"
              >
                {block.text}
              </h2>
            );

          case "p":
            return (
              <p
                key={i}
                className="text-gray-700 leading-relaxed text-lg mb-5"
              >
                {block.text}
              </p>
            );

          case "ul":
            return (
              <ul key={i} className="list-disc pl-6 space-y-2 mb-6 text-gray-700 text-lg leading-relaxed marker:text-green-600">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="my-10 border-l-4 border-green-600 pl-6 py-2"
              >
                <p className="text-xl md:text-2xl italic text-gray-800 leading-relaxed">
                  &ldquo;{block.text}&rdquo;
                </p>
                {block.cite && (
                  <footer className="mt-3 text-sm text-green-700 font-semibold">
                    — {block.cite}
                  </footer>
                )}
              </blockquote>
            );

          case "callout":
            return (
              <div
                key={i}
                className="my-8 bg-green-50 border-l-4 border-green-600 rounded-r-2xl p-5 flex gap-3"
              >
                <svg className="w-6 h-6 text-green-700 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-800 leading-relaxed">{block.text}</p>
              </div>
            );

          case "img":
            return (
              <figure key={i} className="my-10 -mx-4 md:mx-0">
                <div className="rounded-3xl overflow-hidden shadow-xl">
                  <BlogImage
                    src={block.src}
                    alt={block.alt}
                    category={category}
                    fallbackText={block.alt}
                    className="w-full h-auto"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-sm text-gray-500 text-center mt-3 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

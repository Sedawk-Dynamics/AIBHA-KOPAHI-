export default function OrganicDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center py-10 sm:py-16 ${className}`} aria-hidden="true">
      <svg
        className="organic-divider w-40 sm:w-56"
        viewBox="0 0 240 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 12 C 30 4, 60 22, 90 12 S 150 2, 180 14 S 220 18, 238 10"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <circle cx="120" cy="12" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}

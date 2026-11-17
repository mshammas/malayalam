/** Vezhu the Hornbill: a simple placeholder until the final illustrated/animated mascot exists. */
export function Mascot({ size = 120, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Vezhu the Hornbill"
      className={className}
    >
      {/* body */}
      <ellipse cx="52" cy="76" rx="30" ry="32" fill="#2b2118" />
      <ellipse cx="52" cy="84" rx="18" ry="20" fill="#fff8ec" />
      {/* head */}
      <circle cx="56" cy="40" r="22" fill="#2b2118" />
      {/* casque */}
      <path d="M62 22 C78 12 98 16 104 26 C94 26 80 28 70 32 Z" fill="#fab005" />
      {/* beak */}
      <path d="M72 34 C92 32 110 40 114 56 C100 50 84 48 72 48 Z" fill="#e8590c" />
      <path d="M72 48 C84 48 98 52 108 58 C96 60 82 56 72 52 Z" fill="#fab005" />
      {/* eye */}
      <circle cx="60" cy="38" r="7" fill="#fff" />
      <circle cx="62" cy="38" r="3.5" fill="#2b2118" />
      <circle cx="63.2" cy="36.6" r="1.2" fill="#fff" />
      {/* wing */}
      <path d="M26 68 C18 84 24 100 40 104 C34 92 34 80 38 70 Z" fill="#fff8ec" opacity="0.9" />
      {/* feet */}
      <rect x="42" y="104" width="5" height="10" rx="2" fill="#e8590c" />
      <rect x="56" y="104" width="5" height="10" rx="2" fill="#e8590c" />
    </svg>
  );
}

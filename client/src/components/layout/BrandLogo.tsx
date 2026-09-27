interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
}

export const BrandLogo = ({ className = 'h-8 w-auto', showWordmark = true }: BrandLogoProps) => {
  if (!showWordmark) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        fill="none"
        className={className}
      >
        <defs>
          <linearGradient id="atlas-grad-mark" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4F46E5" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="32" height="32" rx="10" fill="url(#atlas-grad-mark)" />
        <circle cx="20" cy="20" r="8" stroke="white" strokeWidth="2" strokeDasharray="3 2" fill="none" />
        <path d="M20 12L23 18.5L20 20L17 18.5L20 12Z" fill="white" />
        <path d="M20 28L17 21.5L20 20L23 21.5L20 28Z" fill="#C7D2FE" />
        <circle cx="20" cy="20" r="1.5" fill="#4F46E5" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 40"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="atlas-grad-full" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      {/* Icon Mark: Modern Compass / Atlas Navigator Orbit */}
      <rect x="4" y="4" width="32" height="32" rx="10" fill="url(#atlas-grad-full)" />
      <circle cx="20" cy="20" r="8" stroke="white" strokeWidth="2" strokeDasharray="3 2" fill="none" />
      <path d="M20 12L23 18.5L20 20L17 18.5L20 12Z" fill="white" />
      <path d="M20 28L17 21.5L20 20L23 21.5L20 28Z" fill="#C7D2FE" />
      <circle cx="20" cy="20" r="1.5" fill="#4F46E5" />
      {/* Wordmark */}
      <text
        x="44"
        y="26"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontSize="20"
        fontWeight="800"
        letterSpacing="-0.5px"
        fill="#00236F"
      >
        Intern<tspan fill="#4F46E5">Atlas</tspan>
      </text>
    </svg>
  );
};

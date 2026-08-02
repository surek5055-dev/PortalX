import { Link } from 'react-router-dom';

export default function Logo({ to = '/', size = 'md' }: { to?: string; size?: 'sm' | 'md' | 'lg' }) {
  const box = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const text = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';
  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      <div className={`${box} rounded-[10px] grid place-items-center shrink-0 transition-transform duration-200 group-hover:scale-105`} style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A8A)' }}>
        <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logo-px" x1="10" y1="8" x2="40" y2="42" gradientUnits="userSpaceOnUse">
              <stop stop-color="#60A5FA" />
              <stop offset="1" stop-color="#22D3EE" />
            </linearGradient>
          </defs>
          {/* P: bold stem + bowl */}
          <path d="M14 11H25C30.5 11 34 15 34 21C34 27 30.5 31 25 31H20V38H14V11Z" fill="url(#logo-px)" />
          {/* P: open portfolio page inside counter */}
          <path d="M20 16V26H24C26.5 26 28 24.5 28 21C28 18.5 26.5 16 24 16H20Z" fill="#0F172A" />
          {/* Page line inside P (subtle portfolio page detail) */}
          <path d="M21 18V24H24C25.5 24 26.5 22.5 26.5 21C26.5 19.5 25.5 18 24 18H21Z" stroke="url(#logo-px)" stroke-width="1.2" fill="none" opacity="0.5" />
          {/* X: bold diagonal strokes */}
          <path d="M26 33L32 39H28L26 36L26 33Z" fill="url(#logo-px)" />
          <path d="M38 33L32 39H36L38 36L38 33Z" fill="url(#logo-px)" />
          <path d="M26 33L32 27H28L26 30L26 33Z" fill="url(#logo-px)" />
          <path d="M38 33L32 27H36L38 30L38 33Z" fill="url(#logo-px)" />
        </svg>
      </div>
      <span className={`${text} font-bold tracking-tight`} style={{ fontFamily: "'Inter', sans-serif" }}>
        PortalX
      </span>
    </Link>
  );
}

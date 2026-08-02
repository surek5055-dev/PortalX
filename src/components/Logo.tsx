import { Link } from 'react-router-dom';

export default function Logo({ to = '/', size = 'md' }: { to?: string; size?: 'sm' | 'md' | 'lg' }) {
  const box = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const text = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';
  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      <div className={`${box} rounded-[10px] grid place-items-center shrink-0 transition-transform group-hover:scale-105`} style={{ background: 'linear-gradient(135deg, #1E40AF, #0EA5E9)' }}>
        <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logo-px" x1="10" y1="8" x2="40" y2="42" gradientUnits="userSpaceOnUse">
              <stop stop-color="#DBEAFE" />
              <stop offset="1" stop-color="#CFFAFE" />
            </linearGradient>
          </defs>
          {/* P shape with open book counter */}
          <path d="M14 12H26C31.5 12 35 16 35 22C35 28 31.5 32 26 32H20V38H14V12Z" fill="url(#logo-px)" />
          <path d="M20 18V26H25C27.5 26 29 24.5 29 22C29 19.5 27.5 18 25 18H20Z" fill="#1E40AF" opacity="0.85" />
          {/* X shape */}
          <path d="M27 34L33 40H29L26 37L27 34Z" fill="url(#logo-px)" />
          <path d="M39 34L33 40H37L40 37L39 34Z" fill="url(#logo-px)" />
          <path d="M27 34L33 28H29L26 31L27 34Z" fill="url(#logo-px)" />
          <path d="M39 34L33 28H37L40 31L39 34Z" fill="url(#logo-px)" />
        </svg>
      </div>
      <span className={`${text} font-bold tracking-tight`} style={{ fontFamily: "'Inter', sans-serif" }}>
        PortalX
      </span>
    </Link>
  );
}

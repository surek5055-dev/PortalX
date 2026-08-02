import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export default function Logo({ to = '/', size = 'md' }: { to?: string; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const icon = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;
  const text = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';
  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      <div
        className={`${dim} rounded-xl grid place-items-center text-white shadow-lg group-hover:scale-105 transition-transform`}
        style={{ background: 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))' }}
      >
        <Layers size={icon} />
      </div>
      <span className={`${text} font-bold tracking-tight`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        PortalX
      </span>
    </Link>
  );
}

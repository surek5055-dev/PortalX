import { Link } from 'react-router-dom';

export default function Logo({
  to = '/',
  size = 'md',
}: {
  to?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dim =
    size === 'sm'
      ? 'w-8 h-8'
      : size === 'lg'
      ? 'w-12 h-12'
      : 'w-10 h-10';

  const icon =
    size === 'sm'
      ? 'text-sm'
      : size === 'lg'
      ? 'text-xl'
      : 'text-lg';

  const text =
    size === 'sm'
      ? 'text-base'
      : size === 'lg'
      ? 'text-2xl'
      : 'text-lg';

  return (
    <Link to={to} className="flex items-center gap-3 group">
      <div
        className={`${dim} rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105`}
        style={{
          background:
            'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))',
        }}
      >
        <span
          className={`${icon} font-black text-white`}
          style={{
            letterSpacing: '-0.08em',
            fontFamily: "'Space Grotesk', sans-serif",
            lineHeight: 1,
          }}
        >
          PX
        </span>
      </div>

      <span
        className={`${text} font-bold tracking-tight`}
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        PortalX
      </span>
    </Link>
  );
}
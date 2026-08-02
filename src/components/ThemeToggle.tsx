import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`relative w-16 h-8 rounded-full border transition-colors ${className}`}
      style={{ background: 'rgb(var(--bg-soft))', borderColor: 'rgb(var(--border))' }}
    >
      <span
        className="absolute top-1 w-6 h-6 rounded-full grid place-items-center transition-all duration-300 shadow-md"
        style={{
          left: theme === 'light' ? '4px' : '32px',
          background: 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))',
          color: 'white',
        }}
      >
        {theme === 'light' ? <Sun size={13} /> : <Moon size={13} />}
      </span>
    </button>
  );
}

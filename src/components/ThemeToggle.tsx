import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`relative w-14 h-7 rounded-full border transition-colors ${className}`}
      style={{ background: 'rgb(var(--bg-soft))', borderColor: 'rgb(var(--border))' }}
    >
      <span
        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full grid place-items-center transition-all duration-300"
        style={{
          left: theme === 'light' ? '3px' : 'calc(100% - 23px)',
          background: theme === 'light' ? 'rgb(251 191 36)' : 'rgb(96 165 250)',
          color: 'white',
          boxShadow: '0 2px 6px rgba(0,0,0,.15)',
        }}
      >
        {theme === 'light' ? <Sun size={11} /> : <Moon size={11} />}
      </span>
    </button>
  );
}

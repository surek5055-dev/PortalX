import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

export default function AuthLayout({ children, title, subtitle, footer }: { children: ReactNode; title: string; subtitle: string; footer?: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-14" style={{ background: 'linear-gradient(160deg, rgb(var(--primary) / .12), rgb(var(--accent) / .08))' }}>
        <div className="absolute inset-0 grid-pattern pointer-events-none" />
        <div className="relative"><Logo size="lg" /></div>
        <div className="space-y-7 max-w-md relative">
          <div className="inline-flex items-center gap-2 chip" style={{ background: 'rgb(var(--primary) / .1)', borderColor: 'rgb(var(--primary) / .2)' }}>
            <Sparkles size={14} style={{ color: 'rgb(var(--primary))' }} /> Professional Portfolio Builder
          </div>
          <h1 className="font-display text-4xl font-semibold leading-[1.15]">
            Your work deserves a <span className="gradient-text">stunning</span> home.
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'rgb(var(--text-soft))' }}>
            Create, edit, and publish a modern portfolio in minutes — projects, skills, blog, and resume — all in one place. No code required.
          </p>
        </div>
        <p className="text-xs relative" style={{ color: 'rgb(var(--text-faint))' }}>© {new Date().getFullYear()} PortalX. Crafted for creators.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col mesh-bg">
        <div className="flex items-center justify-between p-5">
          <Link to="/" className="btn btn-ghost text-sm"><ArrowLeft size={16} /> Home</Link>
          <ThemeToggle />
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md animate-fade-up">
            <div className="lg:hidden mb-8"><Logo size="md" /></div>
            <h2 className="font-display text-3xl font-semibold mb-2">{title}</h2>
            <p className="text-sm mb-8" style={{ color: 'rgb(var(--text-soft))' }}>{subtitle}</p>
            {children}
            {footer && <div className="mt-6 text-sm text-center" style={{ color: 'rgb(var(--text-soft))' }}>{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

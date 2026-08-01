import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

export default function AuthLayout({ children, title, subtitle, footer }: { children: ReactNode; title: string; subtitle: string; footer?: ReactNode }) {
  return (
    <div className="min-h-screen flex mesh-bg">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12" style={{ background: 'linear-gradient(160deg, rgb(var(--primary) / .12), rgb(var(--accent) / .08))' }}>
        <Logo size="lg" />
        <div className="space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 chip">
            <Sparkles size={14} style={{ color: 'rgb(var(--primary))' }} /> Build a portfolio that stands out
          </div>
          <h1 className="text-4xl font-bold leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Your work deserves a <span className="gradient-text">stunning</span> home.
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'rgb(var(--text-soft))' }}>
            Create, edit, and publish a modern portfolio in minutes — projects, skills, blog, and resume — all in one place. No code required.
          </p>
          <div className="flex gap-6 pt-2">
            {[
              { k: '10k+', v: 'Portfolios' },
              { k: '4.9★', v: 'Avg. rating' },
              { k: '100%', v: 'Customizable' },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-2xl font-bold gradient-text">{s.k}</div>
                <div className="text-xs" style={{ color: 'rgb(var(--text-faint))' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs" style={{ color: 'rgb(var(--text-faint))' }}>© {new Date().getFullYear()} PortalX. Crafted for creators.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-5">
          <Link to="/" className="btn btn-ghost text-sm"><ArrowLeft size={16} /> Home</Link>
          <ThemeToggle />
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md animate-fade-up">
            <div className="lg:hidden mb-8"><Logo size="md" /></div>
            <h2 className="text-2xl font-bold mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
            <p className="text-sm mb-7" style={{ color: 'rgb(var(--text-soft))' }}>{subtitle}</p>
            {children}
            {footer && <div className="mt-6 text-sm text-center" style={{ color: 'rgb(var(--text-soft))' }}>{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

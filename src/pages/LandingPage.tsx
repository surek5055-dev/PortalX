import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, LayoutDashboard, Image as ImageIcon, PenLine, Search, Moon, Github, Twitter, Linkedin, Zap } from 'lucide-react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

const features = [
  { icon: LayoutDashboard, title: 'Visual Dashboard', desc: 'Manage every section of your portfolio from one clean, organized workspace.' },
  { icon: ImageIcon, title: 'Image Uploads', desc: 'Drag-and-drop project images and avatars. Stored and served instantly.' },
  { icon: PenLine, title: 'Blog & Projects', desc: 'Write blog posts and showcase projects with tags, links, and featured flags.' },
  { icon: Search, title: 'SEO Ready', desc: 'Per-page meta tags, Open Graph images, and clean slugs for search engines.' },
  { icon: Moon, title: 'Dark / Light', desc: 'A beautiful theme toggle your visitors will love — on any device.' },
  { icon: Zap, title: 'Deploy Ready', desc: 'Production-grade code, responsive layouts, and lightning-fast performance.' },
];

const steps = [
  { n: '01', t: 'Create your account', d: 'Sign up in seconds and land in your personal dashboard.' },
  { n: '02', t: 'Build your sections', d: 'Add about, skills, projects, blog, contact, and social links.' },
  { n: '03', t: 'Publish & share', d: 'Your public portfolio goes live on a clean, shareable link.' },
];

export default function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 glass border-b" style={{ borderColor: 'rgb(var(--border) / .5)' }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how" className="nav-link">How it works</a>
            <a href="#showcase" className="nav-link">Showcase</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:block" />
            {user ? (
              <Link to="/dashboard" className="btn btn-primary"><LayoutDashboard size={16} /> Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost hidden sm:inline-flex">Sign in</Link>
                <Link to="/signup" className="btn btn-primary">Get started <ArrowRight size={16} /></Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden mesh-bg">
        <div className="absolute inset-0 grid-pattern pointer-events-none" />
        <div className="max-w-4xl mx-auto px-5 pt-28 pb-32 text-center relative">
          <div className="inline-flex items-center gap-2 chip animate-fade-up mb-8" style={{ background: 'rgb(var(--primary) / .08)', borderColor: 'rgb(var(--primary) / .2)' }}>
            <Sparkles size={14} style={{ color: 'rgb(var(--primary))' }} />
            <span style={{ color: 'rgb(var(--primary))' }}>The modern portfolio builder</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight animate-fade-up delay-1">
            Build a Portfolio<br />
            That <span className="gradient-text">Opens Doors.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-up delay-2" style={{ color: 'rgb(var(--text-soft))' }}>
            Create a professional portfolio in minutes. Showcase your work, projects, and achievements with confidence.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center animate-fade-up delay-3">
            <Link to="/signup" className="btn btn-primary btn-lg">Get Started <ArrowRight size={18} /></Link>
            <a href="#features" className="btn btn-ghost btn-lg">Explore Features</a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-5 py-24">
        <div className="text-center mb-14">
          <h2 className="section-title">Everything you need to shine</h2>
          <p className="mt-4 text-lg" style={{ color: 'rgb(var(--text-soft))' }}>A complete toolkit for a portfolio that impresses.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={f.title} className={`card card-hover p-7 animate-fade-up delay-${i + 1}`}>
              <div className="w-12 h-12 rounded-xl grid place-items-center mb-5" style={{ background: 'rgb(var(--primary) / .1)' }}>
                <f.icon size={22} style={{ color: 'rgb(var(--primary))' }} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--text-soft))' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24" style={{ background: 'rgb(var(--bg-soft))' }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-14">
            <h2 className="section-title">Live in three steps</h2>
            <p className="mt-4 text-lg" style={{ color: 'rgb(var(--text-soft))' }}>From sign-up to published in minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.n} className={`card p-8 animate-fade-up delay-${i + 1}`}>
                <div className="text-4xl font-bold gradient-text mb-4 font-display">{s.n}</div>
                <h3 className="font-semibold text-lg mb-2">{s.t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--text-soft))' }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase / CTA */}
      <section id="showcase" className="max-w-6xl mx-auto px-5 py-24 text-center">
        <div className="card glass p-12 md:p-20 shadow-xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: 'rgb(var(--primary))' }} />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: 'rgb(var(--accent))' }} />
          <h2 className="text-3xl md:text-4xl font-bold relative">Ready to build yours?</h2>
          <p className="mt-4 relative text-lg" style={{ color: 'rgb(var(--text-soft))' }}>Join thousands of creators showcasing their work with PortalX.</p>
          <Link to="/signup" className="btn btn-primary btn-lg mt-8 relative">Create your portfolio <ArrowRight size={18} /></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: 'rgb(var(--border))' }}>
        <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            {[Github, Twitter, Linkedin].map((I, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg grid place-items-center border transition-all hover:scale-105" style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--text-soft))' }}>
                <I size={16} />
              </a>
            ))}
          </div>
          <p className="text-xs" style={{ color: 'rgb(var(--text-faint))' }}>© {new Date().getFullYear()} PortalX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

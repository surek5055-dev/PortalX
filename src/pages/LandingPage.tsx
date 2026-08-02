import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, LayoutDashboard, Image as ImageIcon, PenLine, Search, Moon, Github, Twitter, Linkedin, Star, Zap } from 'lucide-react';
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
      <header className="sticky top-0 z-50 glass border-b">
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
        <div className="max-w-6xl mx-auto px-5 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 chip animate-fade-up mb-6">
            <Sparkles size={14} style={{ color: 'rgb(var(--primary))' }} /> The modern portfolio builder
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight animate-fade-up delay-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Build a portfolio that<br />
            <span className="gradient-text">gets you noticed.</span>
          </h1>
          <p className="mt-6 text-lg max-w-2xl mx-auto animate-fade-up delay-2" style={{ color: 'rgb(var(--text-soft))' }}>
            A lightweight CMS for creators, developers, and designers. Create, edit, and publish a stunning portfolio — no code, no templates to fight with.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center animate-fade-up delay-3">
            <Link to="/signup" className="btn btn-primary !py-3 !px-6 text-base">Start building free <ArrowRight size={18} /></Link>
            <a href="#features" className="btn btn-ghost !py-3 !px-6 text-base">Explore features</a>
          </div>
          <div className="mt-12 flex items-center justify-center gap-2 animate-fade-up delay-4">
            {[Star, Star, Star, Star, Star].map((I, i) => <I key={i} size={16} className="text-amber-400 fill-amber-400" />)}
            <span className="text-sm ml-2" style={{ color: 'rgb(var(--text-soft))' }}>Loved by 10,000+ creators</span>
          </div>
        </div>
        {/* floating preview card */}
        <div className="max-w-4xl mx-auto px-5 pb-16">
          <div className="card glass animate-float shadow-2xl p-2">
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface-2))' }}>
              <div className="h-44 md:h-56 relative" style={{ background: 'linear-gradient(135deg, rgb(var(--primary) / .25), rgb(var(--accent) / .2))' }}>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-3 grid place-items-center text-white shadow-lg" style={{ background: 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))' }}>
                      <Sparkles size={28} />
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'rgb(var(--text))' }}>Your portfolio preview</p>
                  </div>
                </div>
              </div>
              <div className="p-5 grid grid-cols-3 gap-3">
                {['About', 'Projects', 'Blog', 'Skills', 'Contact', 'Resume'].map((s) => (
                  <div key={s} className="rounded-xl p-3 text-center text-xs font-medium" style={{ background: 'rgb(var(--bg-soft))', color: 'rgb(var(--text-soft))' }}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center mb-12">
          <h2 className="section-title">Everything you need to shine</h2>
          <p className="mt-3" style={{ color: 'rgb(var(--text-soft))' }}>A complete toolkit for a portfolio that impresses.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={f.title} className={`card p-6 hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-up delay-${i + 1}`}>
              <div className="w-11 h-11 rounded-xl grid place-items-center mb-4 text-white shadow-md" style={{ background: 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))' }}>
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold text-lg mb-1.5">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--text-soft))' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20" style={{ background: 'rgb(var(--bg-soft))' }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="section-title">Live in three steps</h2>
            <p className="mt-3" style={{ color: 'rgb(var(--text-soft))' }}>From sign-up to published in minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.n} className={`card p-7 animate-fade-up delay-${i + 1}`}>
                <div className="text-3xl font-bold gradient-text mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.n}</div>
                <h3 className="font-semibold text-lg mb-1.5">{s.t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--text-soft))' }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase / CTA */}
      <section id="showcase" className="max-w-6xl mx-auto px-5 py-20 text-center">
        <div className="card glass p-12 md:p-16 shadow-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-30" style={{ background: 'rgb(var(--primary))' }} />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-30" style={{ background: 'rgb(var(--accent))' }} />
          <h2 className="text-3xl md:text-4xl font-bold relative">Ready to build yours?</h2>
          <p className="mt-3 relative" style={{ color: 'rgb(var(--text-soft))' }}>Join thousands of creators showcasing their work with PortalX.</p>
          <Link to="/signup" className="btn btn-primary !py-3 !px-7 text-base mt-7 relative">Create your portfolio <ArrowRight size={18} /></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: 'rgb(var(--border))' }}>
        <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            {[Github, Twitter, Linkedin].map((I, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg grid place-items-center border hover:scale-105 transition-transform" style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--text-soft))' }}>
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

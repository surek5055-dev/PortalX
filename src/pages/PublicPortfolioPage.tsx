import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Github, Twitter, Linkedin, Instagram, Globe, Dribbble, Mail, Phone, MapPin,
  FileText, ArrowRight, Star, ExternalLink, Calendar, ArrowUpRight, Pencil, Shield,
} from 'lucide-react';
import type { Profile, Project, Skill, BlogPost } from '@/types';

const socialIcon: Record<string, typeof Github> = {
  github: Github, linkedin: Linkedin, twitter: Twitter, instagram: Instagram, dribbble: Dribbble, website: Globe,
};

export default function PublicPortfolioPage() {
  const { user, profile } = useAuth();
  const { setTheme } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.theme) setTheme(profile.theme);
  }, [profile?.theme, setTheme]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [p, s, b] = await Promise.all([
        supabase.from('projects').select('*').eq('user_id', user.id).order('featured', { ascending: false }).order('sort_order', { ascending: true }),
        supabase.from('skills').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
        supabase.from('blog_posts').select('*').eq('user_id', user.id).eq('published', true).order('created_at', { ascending: false }),
      ]);
      setProjects((p.data as Project[]) || []);
      setSkills((s.data as Skill[]) || []);
      setPosts((b.data as BlogPost[]) || []);
      setLoading(false);
    })();
  }, [user]);

  // SEO meta tags
  useEffect(() => {
    if (!profile) return;
    const seo = profile.seo || {};
    const title = seo.title || `${profile.full_name || 'Portfolio'} — PortalX`;
    const desc = seo.description || profile.bio || '';
    document.title = title;
    const set = (attr: string, key: string, val: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    set('name', 'description', desc);
    if (seo.keywords) set('name', 'keywords', seo.keywords);
    set('property', 'og:title', title);
    set('property', 'og:description', desc);
    if (seo.ogImage) set('property', 'og:image', seo.ogImage);
    set('name', 'twitter:card', 'summary_large_image');
    set('name', 'twitter:title', title);
    set('name', 'twitter:description', desc);
    if (seo.ogImage) set('name', 'twitter:image', seo.ogImage);
    return () => { document.title = 'PortalX — Portfolio Builder'; };
  }, [profile]);

  if (loading) {
    return <div className="min-h-screen grid place-items-center mesh-bg"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgb(var(--primary))', borderTopColor: 'transparent' }} /></div>;
  }

  const socials = profile?.social_links || {};
  const featured = projects.filter((p) => p.featured);
  const other = projects.filter((p) => !p.featured);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    ...(projects.length ? [{ id: 'projects', label: 'Projects' }] : []),
    ...(posts.length ? [{ id: 'blog', label: 'Blog' }] : []),
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'rgb(var(--bg))' }}>
      {/* Nav */}
      <header className="sticky top-0 z-40 glass border-b">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <span className="font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{profile?.full_name || 'Your name'}</span>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="nav-link">{n.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {profile?.role === 'admin' && <Link to="/admin" className="btn btn-ghost text-sm hidden sm:inline-flex"><Shield size={15} /></Link>}
            <Link to="/dashboard" className="btn btn-ghost text-sm"><Pencil size={15} /> Edit</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="about" className="relative overflow-hidden mesh-bg">
        <div className="max-w-5xl mx-auto px-5 pt-20 pb-24 text-center">
          <div className="w-28 h-28 rounded-3xl mx-auto mb-6 overflow-hidden shadow-xl animate-scale-in" style={{ background: 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))' }}>
            {profile?.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-4xl font-bold text-white">{(profile?.full_name || '?').charAt(0)}</div>}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-fade-up" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Hi, I'm <span className="gradient-text">{profile?.full_name || 'Your name'}</span>
          </h1>
          <p className="mt-5 text-lg max-w-2xl mx-auto animate-fade-up delay-1" style={{ color: 'rgb(var(--text-soft))' }}>
            {profile?.bio || 'Welcome to my portfolio. Add a bio from your dashboard to introduce yourself.'}
          </p>
          {profile?.location && (
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm animate-fade-up delay-2" style={{ color: 'rgb(var(--text-faint))' }}>
              <MapPin size={14} /> {profile.location}
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3 justify-center animate-fade-up delay-3">
            {navItems.find((n) => n.id === 'projects') && <a href="#projects" className="btn btn-primary">View projects <ArrowRight size={16} /></a>}
            {profile?.resume_url && <a href={profile.resume_url} target="_blank" rel="noreferrer" className="btn btn-ghost"><FileText size={16} /> Resume</a>}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 animate-fade-up delay-4">
            {Object.entries(socials).filter(([, v]) => v).map(([k, v]) => {
              const I = socialIcon[k] || Globe;
              return <a key={k} href={v as string} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl grid place-items-center border hover:scale-110 transition-transform" style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--text-soft))' }}><I size={18} /></a>;
            })}
          </div>
        </div>
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section id="skills" className="max-w-5xl mx-auto px-5 py-20">
          <h2 className="section-title mb-8">Skills</h2>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
            {skills.map((s, i) => (
              <div key={s.id} className={`animate-fade-up delay-${Math.min(i + 1, 5)}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-sm">{s.name}</span>
                  <span className="text-xs" style={{ color: 'rgb(var(--text-faint))' }}>{s.level}%</span>
                </div>
                {s.category && <span className="chip text-[10px] mb-2">{s.category}</span>}
                <div className="h-2 rounded-full overflow-hidden mt-2" style={{ background: 'rgb(var(--bg-soft))' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.level}%`, background: 'linear-gradient(90deg, rgb(var(--primary)), rgb(var(--accent)))' }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section id="projects" className="max-w-5xl mx-auto px-5 py-20" style={{ background: 'rgb(var(--bg-soft))' }}>
          <div className="max-w-5xl mx-auto px-5">
            <h2 className="section-title mb-8">Projects</h2>
            {featured.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4"><Star size={16} className="text-amber-400 fill-amber-400" /><span className="text-sm font-semibold">Featured</span></div>
                <div className="grid md:grid-cols-2 gap-6">
                  {featured.map((p, i) => <ProjectCard key={p.id} p={p} delay={i} large />)}
                </div>
              </div>
            )}
            {other.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {other.map((p, i) => <ProjectCard key={p.id} p={p} delay={i} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Blog */}
      {posts.length > 0 && (
        <section id="blog" className="max-w-5xl mx-auto px-5 py-20">
          <h2 className="section-title mb-8">Blog</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((p, i) => (
              <article key={p.id} className={`card overflow-hidden hover:shadow-lg transition-all animate-fade-up delay-${Math.min(i + 1, 5)}`}>
                {p.image_url && <div className="aspect-video" style={{ background: 'rgb(var(--bg-soft))' }}><img src={p.image_url} alt={p.title} className="w-full h-full object-cover" /></div>}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: 'rgb(var(--text-faint))' }}><Calendar size={12} /> {new Date(p.created_at).toLocaleDateString()}</div>
                  <h3 className="font-semibold mb-1.5">{p.title}</h3>
                  <p className="text-sm line-clamp-2" style={{ color: 'rgb(var(--text-soft))' }}>{p.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="max-w-5xl mx-auto px-5 py-20">
        <div className="card glass p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: 'rgb(var(--primary))' }} />
          <h2 className="text-3xl font-bold relative">Let's work together</h2>
          <p className="mt-3 relative" style={{ color: 'rgb(var(--text-soft))' }}>Have a project in mind? I'd love to hear about it.</p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center relative">
            {profile?.contact_email && <a href={`mailto:${profile.contact_email}`} className="btn btn-primary"><Mail size={16} /> {profile.contact_email}</a>}
            {profile?.phone && <a href={`tel:${profile.phone}`} className="btn btn-ghost"><Phone size={16} /> {profile.phone}</a>}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 relative">
            {Object.entries(socials).filter(([, v]) => v).map(([k, v]) => {
              const I = socialIcon[k] || Globe;
              return <a key={k} href={v as string} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl grid place-items-center border hover:scale-110 transition-transform" style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--text-soft))' }}><I size={18} /></a>;
            })}
          </div>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--text-faint))' }}>
        Built with <span className="gradient-text font-semibold">PortalX</span> · © {new Date().getFullYear()} {profile?.full_name || ''}
      </footer>
    </div>
  );
}

function ProjectCard({ p, delay = 0, large = false }: { p: Project; delay?: number; large?: boolean }) {
  return (
    <div className={`card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all animate-fade-up delay-${Math.min(delay + 1, 5)} ${large ? '' : ''}`}>
      <div className={large ? 'aspect-video' : 'aspect-video'} style={{ background: 'rgb(var(--bg-soft))' }}>
        {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-[rgb(var(--text-faint))]"><ArrowUpRight size={28} /></div>}
      </div>
      <div className="p-5">
        <h3 className="font-semibold mb-1">{p.title}</h3>
        <p className="text-sm line-clamp-2 mb-3" style={{ color: 'rgb(var(--text-soft))' }}>{p.description}</p>
        <div className="flex flex-wrap gap-1.5 items-center">
          {p.tags.slice(0, 3).map((t) => <span key={t} className="chip text-[10px]">{t}</span>)}
          {p.project_url && <a href={p.project_url} target="_blank" rel="noreferrer" className="ml-auto text-xs font-medium flex items-center gap-1" style={{ color: 'rgb(var(--primary))' }}>Visit <ExternalLink size={12} /></a>}
        </div>
      </div>
    </div>
  );
}

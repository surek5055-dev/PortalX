import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FolderGit2, Code2, PenLine, Eye, ArrowUpRight, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { SectionHeader } from './DashboardLayout';

interface Counts { projects: number; skills: number; posts: number; published: number; }

export default function DashboardOverview() {
  const { user, profile } = useAuth();
  const [counts, setCounts] = useState<Counts>({ projects: 0, skills: 0, posts: 0, published: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [p, s, b] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('skills').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('blog_posts').select('id, published', { count: 'exact' }).eq('user_id', user.id),
      ]);
      const posts = b.data ?? [];
      setCounts({
        projects: p.count ?? 0,
        skills: s.count ?? 0,
        posts: b.count ?? 0,
        published: posts.filter((x: { published: boolean }) => x.published).length,
      });
      setLoading(false);
    })();
  }, [user]);

  const cards = [
    { label: 'Projects', value: counts.projects, icon: FolderGit2, to: '/dashboard/projects', color: 'rgb(var(--primary))' },
    { label: 'Skills', value: counts.skills, icon: Code2, to: '/dashboard/skills', color: 'rgb(var(--accent))' },
    { label: 'Blog posts', value: counts.posts, icon: PenLine, to: '/dashboard/blog', color: '#a855f7' },
    { label: 'Published', value: counts.published, icon: CheckCircle2, to: '/dashboard/blog', color: '#f59e0b' },
  ];

  const checklist = [
    { label: 'Add your bio in About', done: !!profile?.bio, to: '/dashboard/about' },
    { label: 'Add at least one project', done: counts.projects > 0, to: '/dashboard/projects' },
    { label: 'List your skills', done: counts.skills > 0, to: '/dashboard/skills' },
    { label: 'Write a blog post', done: counts.posts > 0, to: '/dashboard/blog' },
    { label: 'Add social links', done: !!(profile?.social_links && Object.keys(profile.social_links).length), to: '/dashboard/social' },
  ];

  return (
    <div>
      <SectionHeader title="Overview" desc="A quick look at your portfolio." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <Link key={c.label} to={c.to} className={`card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all animate-fade-up delay-${i + 1}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl grid place-items-center text-white shadow" style={{ background: c.color }}>
                <c.icon size={18} />
              </div>
              <ArrowUpRight size={16} style={{ color: 'rgb(var(--text-faint))' }} />
            </div>
            <div className="text-3xl font-bold">{loading ? '—' : c.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgb(var(--text-soft))' }}>{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-6 lg:col-span-2 animate-fade-up delay-3">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} style={{ color: 'rgb(var(--primary))' }} />
            <h3 className="font-semibold">Getting started</h3>
          </div>
          <div className="space-y-2.5">
            {checklist.map((c) => (
              <Link key={c.label} to={c.to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[rgb(var(--bg-soft))] transition-colors">
                <CheckCircle2 size={18} className={c.done ? 'text-emerald-500' : ''} style={c.done ? undefined : { color: 'rgb(var(--text-faint))' }} />
                <span className="text-sm flex-1" style={{ color: c.done ? 'rgb(var(--text-soft))' : 'rgb(var(--text))', textDecoration: c.done ? 'line-through' : 'none' }}>{c.label}</span>
                {!c.done && <span className="text-xs font-medium" style={{ color: 'rgb(var(--primary))' }}>Add</span>}
              </Link>
            ))}
          </div>
        </div>
        <div className="card p-6 animate-fade-up delay-4 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-20" style={{ background: 'rgb(var(--primary))' }} />
          <Sparkles size={22} style={{ color: 'rgb(var(--primary))' }} className="mb-3" />
          <h3 className="font-semibold mb-1">Publish your portfolio</h3>
          <p className="text-sm mb-4" style={{ color: 'rgb(var(--text-soft))' }}>Your portfolio is live and shareable anytime.</p>
          <Link to="/p" target="_blank" className="btn btn-primary w-full text-sm"><Eye size={16} /> View public page</Link>
        </div>
      </div>
    </div>
  );
}

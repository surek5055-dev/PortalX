import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Shield, Users, FileText, Code2, FolderGit2, Eye, Loader2, Search, ExternalLink, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import type { Profile, Project, Skill, BlogPost } from '@/types';

interface Row {
  profile: Profile;
  counts: { projects: number; skills: number; posts: number };
}

export default function AdminPage() {
  const { user, signOut } = useAuth();
  const { push } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    (async () => {
      const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (!profiles) { setLoading(false); return; }
      const [p, s, b] = await Promise.all([
        supabase.from('projects').select('user_id'),
        supabase.from('skills').select('user_id'),
        supabase.from('blog_posts').select('user_id'),
      ]);
      const count = (arr: { user_id: string }[] | null) => {
        const m: Record<string, number> = {};
        (arr || []).forEach((x) => { m[x.user_id] = (m[x.user_id] || 0) + 1; });
        return m;
      };
      const pc = count(p.data as { user_id: string }[] | null);
      const sc = count(s.data as { user_id: string }[] | null);
      const bc = count(b.data as { user_id: string }[] | null);
      const built: Row[] = (profiles as Profile[]).map((profile) => ({
        profile,
        counts: { projects: pc[profile.id] || 0, skills: sc[profile.id] || 0, posts: bc[profile.id] || 0 },
      }));
      setRows(built);
      setLoading(false);
    })();
  }, []);

  const totalUsers = rows.length;
  const totalProjects = rows.reduce((a, r) => a + r.counts.projects, 0);
  const totalSkills = rows.reduce((a, r) => a + r.counts.skills, 0);
  const totalPosts = rows.reduce((a, r) => a + r.counts.posts, 0);

  const filtered = rows.filter((r) => {
    const t = q.toLowerCase();
    return !t || (r.profile.full_name || '').toLowerCase().includes(t) || (r.profile.contact_email || r.profile.id).toLowerCase().includes(t);
  });

  const handleSignOut = async () => { await signOut(); push('Signed out.'); };

  return (
    <div className="min-h-screen" style={{ background: 'rgb(var(--bg))' }}>
      <header className="sticky top-0 z-40 glass border-b">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="chip text-[10px] !text-amber-600 !bg-amber-400/10"><Shield size={11} /> Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/dashboard" className="btn btn-ghost text-sm"><ArrowLeft size={15} /> Dashboard</Link>
            <button onClick={handleSignOut} className="btn btn-ghost text-sm" style={{ color: 'rgb(239 68 68)' }}>Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-3xl font-semibold">Admin Panel</h1>
          <p className="text-sm mt-1" style={{ color: 'rgb(var(--text-soft))' }}>Signed in as {user?.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total users', value: totalUsers, icon: Users, color: 'rgb(var(--primary))' },
            { label: 'Projects', value: totalProjects, icon: FolderGit2, color: 'rgb(var(--accent))' },
            { label: 'Skills', value: totalSkills, icon: Code2, color: '#a855f7' },
            { label: 'Blog posts', value: totalPosts, icon: FileText, color: '#f59e0b' },
          ].map((c, i) => (
            <div key={c.label} className={`card card-hover p-6 animate-fade-up delay-${i + 1}`}>
              <div className="w-10 h-10 rounded-xl grid place-items-center text-white shadow mb-3" style={{ background: c.color }}><c.icon size={18} /></div>
              <div className="text-3xl font-bold font-display">{loading ? '—' : c.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgb(var(--text-soft))' }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div className="card overflow-hidden animate-fade-up delay-3">
          <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: 'rgb(var(--border))' }}>
            <h2 className="font-semibold">All users</h2>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--text-faint))' }} />
              <input className="input pl-9 w-full sm:w-64" placeholder="Search users..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
          {loading ? (
            <div className="p-10 grid place-items-center"><Loader2 className="animate-spin" style={{ color: 'rgb(var(--primary))' }} /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left" style={{ color: 'rgb(var(--text-faint))' }}>
                    <th className="p-4 font-semibold text-xs uppercase">User</th>
                    <th className="p-4 font-semibold text-xs uppercase">Role</th>
                    <th className="p-4 font-semibold text-xs uppercase text-center">Projects</th>
                    <th className="p-4 font-semibold text-xs uppercase text-center">Skills</th>
                    <th className="p-4 font-semibold text-xs uppercase text-center">Posts</th>
                    <th className="p-4 font-semibold text-xs uppercase text-right">View</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.profile.id} className="border-t hover:bg-[rgb(var(--bg-soft))] transition-colors" style={{ borderColor: 'rgb(var(--border))' }}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0" style={{ background: 'rgb(var(--bg-soft))' }}>
                            {r.profile.avatar_url ? <img src={r.profile.avatar_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center font-bold text-xs" style={{ color: 'rgb(var(--primary))' }}>{(r.profile.full_name || '?').charAt(0)}</div>}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{r.profile.full_name || 'Unnamed'}</p>
                            <p className="text-xs truncate" style={{ color: 'rgb(var(--text-faint))' }}>{r.profile.contact_email || r.profile.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {r.profile.role === 'admin' ? <span className="chip text-[10px] !text-amber-600"><Shield size={10} /> Admin</span> : <span className="chip text-[10px]">User</span>}
                      </td>
                      <td className="p-4 text-center font-medium">{r.counts.projects}</td>
                      <td className="p-4 text-center font-medium">{r.counts.skills}</td>
                      <td className="p-4 text-center font-medium">{r.counts.posts}</td>
                      <td className="p-4 text-right">
                        {r.profile.id === user?.id ? (
                          <Link to="/p" target="_blank" className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: 'rgb(var(--primary))' }}><Eye size={13} /> View <ExternalLink size={11} /></Link>
                        ) : <span className="text-xs" style={{ color: 'rgb(var(--text-faint))' }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="p-10 text-center text-sm" style={{ color: 'rgb(var(--text-soft))' }}>No users match your search.</div>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

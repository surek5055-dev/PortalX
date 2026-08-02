import { ReactNode, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Code2, FolderGit2, PenLine, Mail, Link2, FileText, Search,
  LogOut, Menu, X, ExternalLink, Shield, Eye,
} from 'lucide-react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const nav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/about', label: 'About', icon: User },
  { to: '/dashboard/skills', label: 'Skills', icon: Code2 },
  { to: '/dashboard/projects', label: 'Projects', icon: FolderGit2 },
  { to: '/dashboard/blog', label: 'Blog', icon: PenLine },
  { to: '/dashboard/contact', label: 'Contact', icon: Mail },
  { to: '/dashboard/social', label: 'Social Links', icon: Link2 },
  { to: '/dashboard/resume', label: 'Resume', icon: FileText },
  { to: '/dashboard/seo', label: 'SEO & Meta', icon: Search },
];

export default function DashboardLayout() {
  const { user, profile, role, signOut } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    push('Signed out.');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'rgb(var(--bg))' }}>
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 z-50 flex flex-col border-r transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: 'rgb(var(--surface))', borderColor: 'rgb(var(--border))' }}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b" style={{ borderColor: 'rgb(var(--border))' }}>
          <Logo />
          <button className="lg:hidden" onClick={() => setOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgb(var(--text-faint))' }}>Portfolio</p>
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'active' : ''}`}
              style={undefined}
            >
              {({ isActive }) => (
                <>
                  <n.icon size={18} className={isActive ? '' : 'opacity-70'} style={isActive ? { color: 'rgb(var(--primary))' } : undefined} />
                  <span style={isActive ? { color: 'rgb(var(--primary))' } : { color: 'rgb(var(--text-soft))' }}>{n.label}</span>
                </>
              )}
            </NavLink>
          ))}
          {role === 'admin' && (
            <>
              <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgb(var(--text-faint))' }}>Admin</p>
              <NavLink to="/admin" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive ? 'active' : ''}`}>
                <Shield size={18} />
                <span>Admin Panel</span>
              </NavLink>
            </>
          )}
        </nav>
        <div className="p-3 border-t" style={{ borderColor: 'rgb(var(--border))' }}>
          <Link to="/p" target="_blank" className="btn btn-ghost w-full text-sm mb-2">
            <Eye size={16} /> View public portfolio <ExternalLink size={13} className="opacity-60" />
          </Link>
          <button onClick={handleSignOut} className="btn btn-ghost w-full text-sm" style={{ color: 'rgb(239 68 68)' }}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 glass border-b">
          <div className="h-16 px-5 flex items-center justify-between">
            <button className="lg:hidden" onClick={() => setOpen(true)}><Menu size={22} /></button>
            <div className="flex items-center gap-3 ml-auto">
              <ThemeToggle />
              <div className="flex items-center gap-2.5 pl-3 border-l" style={{ borderColor: 'rgb(var(--border))' }}>
                <div className="w-9 h-9 rounded-full overflow-hidden border" style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--bg-soft))' }}>
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-sm font-bold" style={{ color: 'rgb(var(--primary))' }}>
                      {(profile?.full_name || user?.email || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="hidden sm:block leading-tight">
                  <p className="text-sm font-semibold">{profile?.full_name || 'Your name'}</p>
                  <p className="text-xs" style={{ color: 'rgb(var(--text-faint))' }}>{role === 'admin' ? 'Administrator' : 'Creator'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-5 md:p-8 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function SectionHeader({ title, desc, action }: { title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h1>
        <p className="text-sm mt-1" style={{ color: 'rgb(var(--text-soft))' }}>{desc}</p>
      </div>
      {action}
    </div>
  );
}

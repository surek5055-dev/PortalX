import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Loader2, X, FolderGit2, Star, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import ImageUpload from '@/components/ImageUpload';
import { SectionHeader } from './DashboardLayout';
import type { Project } from '@/types';

const empty = { title: '', description: '', image_url: '', project_url: '', tags: '', featured: false };

export default function ProjectsSection() {
  const { user } = useAuth();
  const { push } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from('projects').select('*').eq('user_id', user.id).order('sort_order', { ascending: true });
    setProjects((data as Project[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const openNew = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, image_url: p.image_url, project_url: p.project_url, tags: p.tags.join(', '), featured: p.featured });
    setShowForm(true);
  };

  const save = async () => {
    if (!user) return;
    if (!form.title.trim()) return push('Project title is required', 'error');
    setBusy(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      image_url: form.image_url,
      project_url: form.project_url.trim(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      featured: form.featured,
    };
    if (editing) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editing.id);
      if (error) { setBusy(false); return push(error.message, 'error'); }
      push('Project updated.');
    } else {
      const { error } = await supabase.from('projects').insert({ ...payload, sort_order: projects.length });
      if (error) { setBusy(false); return push(error.message, 'error'); }
      push('Project added.');
    }
    setBusy(false);
    setShowForm(false);
    load();
  };

  const remove = async (p: Project) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    setProjects((s) => s.filter((x) => x.id !== p.id));
    const { error } = await supabase.from('projects').delete().eq('id', p.id);
    if (error) { load(); return push(error.message, 'error'); }
    push('Project deleted.');
  };

  return (
    <div>
      <SectionHeader title="Projects" desc="Showcase your best work." action={
        <button onClick={openNew} className="btn btn-primary"><Plus size={16} /> New project</button>
      } />

      {loading ? (
        <div className="card p-10 grid place-items-center"><Loader2 className="animate-spin" style={{ color: 'rgb(var(--primary))' }} /></div>
      ) : projects.length === 0 ? (
        <div className="card p-12 text-center animate-fade-in">
          <FolderGit2 size={32} className="mx-auto mb-4" style={{ color: 'rgb(var(--text-faint))' }} />
          <h3 className="font-semibold mb-1">No projects yet</h3>
          <p className="text-sm mb-5" style={{ color: 'rgb(var(--text-soft))' }}>Add your first project to show off your work.</p>
          <button onClick={openNew} className="btn btn-primary"><Plus size={16} /> New project</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <div key={p.id} className={`card overflow-hidden hover:shadow-lg transition-all animate-fade-up delay-${Math.min(i + 1, 5)}`}>
              <div className="aspect-video relative" style={{ background: 'rgb(var(--bg-soft))' }}>
                {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" /> : <div className="absolute inset-0 grid place-items-center text-[rgb(var(--text-faint))]"><FolderGit2 size={28} /></div>}
                {p.featured && <span className="absolute top-3 left-3 chip !bg-amber-400/90 !text-white !border-0"><Star size={12} /> Featured</span>}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg grid place-items-center glass-soft hover:scale-105 transition-transform"><Pencil size={14} /></button>
                  <button onClick={() => remove(p)} className="w-8 h-8 rounded-lg grid place-items-center glass-soft hover:scale-105 transition-transform text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold mb-1">{p.title}</h3>
                <p className="text-sm line-clamp-2 mb-3" style={{ color: 'rgb(var(--text-soft))' }}>{p.description || 'No description'}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 4).map((t) => <span key={t} className="chip text-[10px]">{t}</span>)}
                  {p.project_url && <a href={p.project_url} target="_blank" rel="noreferrer" className="chip text-[10px] hover:!text-[rgb(var(--primary))]"><ExternalLink size={10} /> Visit</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b sticky top-0 glass z-10" style={{ borderColor: 'rgb(var(--border))' }}>
              <h3 className="font-semibold">{editing ? 'Edit project' : 'New project'}</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <ImageUpload value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} kind="project" label="Cover image" />
              <div>
                <label className="label">Title</label>
                <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="My awesome project" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input min-h-[100px] resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does it do? What tech did you use?" />
              </div>
              <div>
                <label className="label">Project URL</label>
                <input className="input" value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <label className="label">Tags (comma separated)</label>
                <input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="React, TypeScript, Tailwind" />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-[rgb(var(--primary))]" />
                <span className="text-sm font-medium">Mark as featured</span>
              </label>
              <button onClick={save} disabled={busy} className="btn btn-primary w-full disabled:opacity-60">
                {busy ? <Loader2 size={16} className="animate-spin" /> : null} {editing ? 'Save changes' : 'Add project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Loader2, X, PenLine, Globe, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import ImageUpload from '@/components/ImageUpload';
import { SectionHeader } from './DashboardLayout';
import type { BlogPost } from '@/types';

const empty = { title: '', slug: '', excerpt: '', content: '', image_url: '', published: false };

function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

export default function BlogSection() {
  const { user } = useAuth();
  const { push } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from('blog_posts').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setPosts((data as BlogPost[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const openNew = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, image_url: p.image_url, published: p.published });
    setShowForm(true);
  };

  const save = async () => {
    if (!user) return;
    if (!form.title.trim()) return push('Title is required', 'error');
    const slug = (form.slug.trim() || slugify(form.title)) + '-' + Math.random().toString(36).slice(2, 6);
    setBusy(true);
    const payload = {
      title: form.title.trim(),
      slug,
      excerpt: form.excerpt.trim(),
      content: form.content,
      image_url: form.image_url,
      published: form.published,
    };
    if (editing) {
      const { error } = await supabase.from('blog_posts').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id);
      if (error) { setBusy(false); return push(error.message, 'error'); }
      push('Post updated.');
    } else {
      const { error } = await supabase.from('blog_posts').insert(payload);
      if (error) { setBusy(false); return push(error.message, 'error'); }
      push('Post created.');
    }
    setBusy(false);
    setShowForm(false);
    load();
  };

  const remove = async (p: BlogPost) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    setPosts((s) => s.filter((x) => x.id !== p.id));
    const { error } = await supabase.from('blog_posts').delete().eq('id', p.id);
    if (error) { load(); return push(error.message, 'error'); }
    push('Post deleted.');
  };

  const togglePublished = async (p: BlogPost) => {
    const next = !p.published;
    setPosts((s) => s.map((x) => (x.id === p.id ? { ...x, published: next } : x)));
    await supabase.from('blog_posts').update({ published: next, updated_at: new Date().toISOString() }).eq('id', p.id);
    push(next ? 'Post published.' : 'Post unpublished.');
  };

  return (
    <div>
      <SectionHeader title="Blog" desc="Write posts and share your thoughts." action={
        <button onClick={openNew} className="btn btn-primary"><Plus size={16} /> New post</button>
      } />

      {loading ? (
        <div className="card p-10 grid place-items-center"><Loader2 className="animate-spin" style={{ color: 'rgb(var(--primary))' }} /></div>
      ) : posts.length === 0 ? (
        <div className="card p-12 text-center animate-fade-in">
          <PenLine size={32} className="mx-auto mb-4" style={{ color: 'rgb(var(--text-faint))' }} />
          <h3 className="font-semibold mb-1">No posts yet</h3>
          <p className="text-sm mb-5" style={{ color: 'rgb(var(--text-soft))' }}>Write your first blog post.</p>
          <button onClick={openNew} className="btn btn-primary"><Plus size={16} /> New post</button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p, i) => (
            <div key={p.id} className={`card card-hover p-4 flex items-center gap-4 animate-fade-up delay-${Math.min(i + 1, 5)}`}>
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0" style={{ background: 'rgb(var(--bg-soft))' }}>
                {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-[rgb(var(--text-faint))]"><PenLine size={20} /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm truncate">{p.title}</h3>
                  {p.published ? <span className="chip text-[10px] !text-emerald-600"><Globe size={10} /> Published</span> : <span className="chip text-[10px]"><EyeOff size={10} /> Draft</span>}
                </div>
                <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'rgb(var(--text-soft))' }}>{p.excerpt || 'No excerpt'}</p>
              </div>
              <button onClick={() => togglePublished(p)} className="btn btn-ghost text-xs">{p.published ? 'Unpublish' : 'Publish'}</button>
              <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg grid place-items-center hover:bg-[rgb(var(--bg-soft))]"><Pencil size={15} /></button>
              <button onClick={() => remove(p)} className="w-8 h-8 rounded-lg grid place-items-center hover:bg-[rgb(var(--bg-soft))] text-red-500"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b sticky top-0 glass z-10" style={{ borderColor: 'rgb(var(--border))' }}>
              <h3 className="font-semibold">{editing ? 'Edit post' : 'New post'}</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <ImageUpload value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} kind="blog" label="Cover image" />
              <div>
                <label className="label">Title</label>
                <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="My first blog post" />
              </div>
              <div>
                <label className="label">Excerpt</label>
                <textarea className="input min-h-[70px] resize-y" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="A short summary shown in lists and previews." />
              </div>
              <div>
                <label className="label">Content</label>
                <textarea className="input min-h-[220px] resize-y font-mono text-[13px] leading-relaxed" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your post content here..." />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-[rgb(var(--primary))]" />
                <span className="text-sm font-medium">Publish immediately</span>
              </label>
              <button onClick={save} disabled={busy} className="btn btn-primary w-full disabled:opacity-60">
                {busy ? <Loader2 size={16} className="animate-spin" /> : null} {editing ? 'Save changes' : 'Create post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

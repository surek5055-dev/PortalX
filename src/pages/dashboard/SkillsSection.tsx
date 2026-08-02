import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, GripVertical, Code2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { SectionHeader } from './DashboardLayout';
import type { Skill } from '@/types';

export default function SkillsSection() {
  const { user } = useAuth();
  const { push } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [level, setLevel] = useState(70);
  const [category, setCategory] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from('skills').select('*').eq('user_id', user.id).order('sort_order', { ascending: true });
    setSkills((data as Skill[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const add = async () => {
    if (!user || !name.trim()) return push('Enter a skill name', 'error');
    setBusy(true);
    const { data, error } = await supabase
      .from('skills')
      .insert({ name: name.trim(), level, category: category.trim(), sort_order: skills.length })
      .select('*')
      .maybeSingle();
    setBusy(false);
    if (error) return push(error.message, 'error');
    if (data) setSkills((s) => [...s, data as Skill]);
    setName(''); setLevel(70); setCategory('');
    push('Skill added.');
  };

  const remove = async (id: string) => {
    const prev = skills;
    setSkills((s) => s.filter((x) => x.id !== id));
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) { setSkills(prev); return push(error.message, 'error'); }
    push('Skill removed.');
  };

  const updateLevel = async (id: string, lvl: number) => {
    setSkills((s) => s.map((x) => (x.id === id ? { ...x, level: lvl } : x)));
    await supabase.from('skills').update({ level: lvl }).eq('id', id);
  };

  return (
    <div>
      <SectionHeader title="Skills" desc="Show what you're great at." />
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-6 space-y-4 animate-fade-up h-fit">
          <div className="flex items-center gap-2 mb-1">
            <Plus size={18} style={{ color: 'rgb(var(--primary))' }} />
            <h3 className="font-semibold">Add a skill</h3>
          </div>
          <div>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="React" />
          </div>
          <div>
            <label className="label">Category</label>
            <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Frontend" />
          </div>
          <div>
            <label className="label">Proficiency: {level}%</label>
            <input type="range" min={0} max={100} value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full accent-[rgb(var(--primary))]" />
          </div>
          <button onClick={add} disabled={busy} className="btn btn-primary w-full disabled:opacity-60">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add skill
          </button>
        </div>

        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="card p-10 grid place-items-center"><Loader2 className="animate-spin" style={{ color: 'rgb(var(--primary))' }} /></div>
          ) : skills.length === 0 ? (
            <div className="card p-10 text-center animate-fade-in">
              <Code2 size={28} className="mx-auto mb-3" style={{ color: 'rgb(var(--text-faint))' }} />
              <p className="text-sm" style={{ color: 'rgb(var(--text-soft))' }}>No skills yet. Add your first one.</p>
            </div>
          ) : (
            skills.map((s, i) => (
              <div key={s.id} className={`card p-4 flex items-center gap-3 animate-fade-up delay-${Math.min(i + 1, 5)}`}>
                <GripVertical size={16} style={{ color: 'rgb(var(--text-faint))' }} className="cursor-grab" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm truncate">{s.name}</span>
                    {s.category && <span className="chip text-[10px]">{s.category}</span>}
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgb(var(--bg-soft))' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${s.level}%`, background: 'linear-gradient(90deg, rgb(var(--primary)), rgb(var(--accent)))' }} />
                  </div>
                </div>
                <input type="range" min={0} max={100} value={s.level} onChange={(e) => updateLevel(s.id, Number(e.target.value))} className="w-24 accent-[rgb(var(--primary))]" />
                <span className="text-xs w-9 text-right" style={{ color: 'rgb(var(--text-soft))' }}>{s.level}%</span>
                <button onClick={() => remove(s.id)} className="text-[rgb(var(--text-faint))] hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

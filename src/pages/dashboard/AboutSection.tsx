import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';
import ImageUpload from '@/components/ImageUpload';
import { SectionHeader } from './DashboardLayout';

export default function AboutSection() {
  const { user, profile, refreshProfile } = useAuth();
  const { push } = useToast();
  const { setTheme } = useTheme();
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [theme, setLocalTheme] = useState<'light' | 'dark'>('light');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setBio(profile.bio || '');
      setAvatar(profile.avatar_url || '');
      setLocalTheme(profile.theme || 'light');
    }
  }, [profile]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, bio, avatar_url: avatar, theme })
      .eq('id', user.id);
    setBusy(false);
    if (error) return push(error.message, 'error');
    setTheme(theme);
    await refreshProfile();
    push('About section saved.');
  };

  return (
    <div>
      <SectionHeader title="About" desc="Introduce yourself. This appears at the top of your portfolio." />
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-6 animate-fade-up">
          <ImageUpload value={avatar} onChange={setAvatar} kind="avatar" label="Profile photo" rounded />
          <p className="text-xs mt-2" style={{ color: 'rgb(var(--text-faint))' }}>Square image recommended.</p>
        </div>
        <div className="card p-6 lg:col-span-2 space-y-4 animate-fade-up delay-1">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Designer" />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea className="input min-h-[140px] resize-y" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short, punchy intro about who you are and what you do..." />
            <p className="text-xs mt-1" style={{ color: 'rgb(var(--text-faint))' }}>{bio.length} characters</p>
          </div>
          <div>
            <label className="label">Portfolio theme</label>
            <div className="flex gap-2">
              {(['light', 'dark'] as const).map((t) => (
                <button key={t} onClick={() => setLocalTheme(t)} className={`btn ${theme === t ? 'btn-primary' : 'btn-ghost'} text-sm capitalize`}>{t}</button>
              ))}
            </div>
          </div>
          <button onClick={save} disabled={busy} className="btn btn-primary disabled:opacity-60">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

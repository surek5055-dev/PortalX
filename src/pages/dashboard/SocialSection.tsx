import { useEffect, useState } from 'react';
import { Loader2, Save, Github, Twitter, Linkedin, Instagram, Globe, Dribbble } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { SectionHeader } from './DashboardLayout';
import type { SocialLinks } from '@/types';

const fields: { key: keyof SocialLinks; label: string; icon: typeof Github; placeholder: string }[] = [
  { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/you' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/you' },
  { key: 'twitter', label: 'Twitter / X', icon: Twitter, placeholder: 'https://x.com/you' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/you' },
  { key: 'dribbble', label: 'Dribbble', icon: Dribbble, placeholder: 'https://dribbble.com/you' },
  { key: 'website', label: 'Personal website', icon: Globe, placeholder: 'https://yoursite.com' },
];

export default function SocialSection() {
  const { user, profile, refreshProfile } = useAuth();
  const { push } = useToast();
  const [links, setLinks] = useState<SocialLinks>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) setLinks(profile.social_links || {});
  }, [profile]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from('profiles').update({ social_links: links }).eq('id', user.id);
    setBusy(false);
    if (error) return push(error.message, 'error');
    await refreshProfile();
    push('Social links saved.');
  };

  return (
    <div>
      <SectionHeader title="Social Links" desc="Connect your profiles across the web." />
      <div className="card p-6 max-w-xl space-y-4 animate-fade-up">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="label flex items-center gap-1.5"><f.icon size={14} /> {f.label}</label>
            <div className="relative">
              <f.icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" style={{ color: 'rgb(var(--text-faint))' }} />
              <input
                className="input pl-10"
                value={links[f.key] || ''}
                onChange={(e) => setLinks({ ...links, [f.key]: e.target.value })}
                placeholder={f.placeholder}
              />
            </div>
          </div>
        ))}
        <button onClick={save} disabled={busy} className="btn btn-primary disabled:opacity-60">
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save links
        </button>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { Loader2, Save, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';
import { SectionHeader } from './DashboardLayout';
import type { SeoMeta } from '@/types';
import { useState } from 'react';

export default function SeoSection() {
  const { user, profile, refreshProfile } = useAuth();
  const { push } = useToast();
  const { theme } = useTheme();
  const [seo, setSeo] = useState<SeoMeta>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (profile) setSeo(profile.seo || {}); }, [profile]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from('profiles').update({ seo }).eq('id', user.id);
    setBusy(false);
    if (error) return push(error.message, 'error');
    await refreshProfile();
    push('SEO settings saved.');
  };

  const title = seo.title || `${profile?.full_name || 'My'} Portfolio`;
  const desc = seo.description || profile?.bio?.slice(0, 150) || 'Check out my portfolio.';
  const url = typeof window !== 'undefined' ? window.location.origin + '/p' : '';

  return (
    <div>
      <SectionHeader title="SEO & Meta Tags" desc="Control how your portfolio looks in search results." />
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-6 space-y-4 animate-fade-up">
          <div>
            <label className="label">Meta title</label>
            <input className="input" value={seo.title || ''} onChange={(e) => setSeo({ ...seo, title: e.target.value })} placeholder={`${profile?.full_name || 'Your name'} — Portfolio`} />
            <p className="text-xs mt-1" style={{ color: 'rgb(var(--text-faint))' }}>{(seo.title || '').length}/60 characters recommended</p>
          </div>
          <div>
            <label className="label">Meta description</label>
            <textarea className="input min-h-[90px] resize-y" value={seo.description || ''} onChange={(e) => setSeo({ ...seo, description: e.target.value })} placeholder="A short description for search engines." />
            <p className="text-xs mt-1" style={{ color: 'rgb(var(--text-faint))' }}>{(seo.description || '').length}/160 characters recommended</p>
          </div>
          <div>
            <label className="label">Keywords (comma separated)</label>
            <input className="input" value={seo.keywords || ''} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} placeholder="designer, developer, portfolio" />
          </div>
          <div>
            <label className="label">Open Graph image URL</label>
            <input className="input" value={seo.ogImage || ''} onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })} placeholder="https://... (1200x630 recommended)" />
          </div>
          <button onClick={save} disabled={busy} className="btn btn-primary disabled:opacity-60">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save SEO settings
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="card p-6 animate-fade-up delay-1">
            <div className="flex items-center gap-2 mb-4"><Search size={16} style={{ color: 'rgb(var(--primary))' }} /><h3 className="font-semibold text-sm">Search preview</h3></div>
            <div className="rounded-xl p-4" style={{ background: theme === 'dark' ? '#202124' : '#fff', color: theme === 'dark' ? '#e8eaed' : '#202124' }}>
              <div className="text-xs truncate" style={{ color: theme === 'dark' ? '#8ab4f8' : '#1a0dab' }}>{url || 'https://your-portfolio.com'}</div>
              <div className="text-lg leading-snug mt-0.5 truncate" style={{ color: theme === 'dark' ? '#8ab4f8' : '#1a0dab' }}>{title}</div>
              <div className="text-sm mt-0.5 line-clamp-2">{desc}</div>
            </div>
          </div>
          <div className="card p-6 animate-fade-up delay-2">
            <h3 className="font-semibold text-sm mb-3">Social card (Open Graph)</h3>
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'rgb(var(--border))' }}>
              <div className="aspect-[1.91/1] relative" style={{ background: 'linear-gradient(135deg, rgb(var(--primary) / .3), rgb(var(--accent) / .2))' }}>
                {seo.ogImage && <img src={seo.ogImage} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="p-3" style={{ background: theme === 'dark' ? '#1c1c1c' : '#f0f0f0' }}>
                <div className="text-[10px] uppercase" style={{ color: 'rgb(var(--text-faint))' }}>{url || 'your-portfolio.com'}</div>
                <div className="text-sm font-semibold truncate">{title}</div>
                <div className="text-xs line-clamp-2" style={{ color: 'rgb(var(--text-soft))' }}>{desc}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

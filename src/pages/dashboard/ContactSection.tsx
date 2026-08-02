import { useEffect, useState } from 'react';
import { Loader2, Save, Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { SectionHeader } from './DashboardLayout';

export default function ContactSection() {
  const { user, profile, refreshProfile } = useAuth();
  const { push } = useToast();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) {
      setEmail(profile.contact_email || '');
      setPhone(profile.phone || '');
      setLocation(profile.location || '');
    }
  }, [profile]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from('profiles').update({ contact_email: email, phone, location }).eq('id', user.id);
    setBusy(false);
    if (error) return push(error.message, 'error');
    await refreshProfile();
    push('Contact info saved.');
  };

  return (
    <div>
      <SectionHeader title="Contact" desc="How visitors can reach you." />
      <div className="card p-6 max-w-xl space-y-4 animate-fade-up">
        <div>
          <label className="label">Contact email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--text-faint))' }} />
            <input className="input pl-10" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@example.com" />
          </div>
        </div>
        <div>
          <label className="label">Phone</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--text-faint))' }} />
            <input className="input pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" />
          </div>
        </div>
        <div>
          <label className="label">Location</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--text-faint))' }} />
            <input className="input pl-10" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco, CA" />
          </div>
        </div>
        <button onClick={save} disabled={busy} className="btn btn-primary disabled:opacity-60">
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save contact info
        </button>
      </div>
    </div>
  );
}

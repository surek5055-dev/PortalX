import { useEffect, useState } from 'react';
import { Loader2, Save, FileText, Upload, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { uploadImage } from '@/lib/storage';
import { SectionHeader } from './DashboardLayout';

export default function ResumeSection() {
  const { user, profile, refreshProfile } = useAuth();
  const { push } = useToast();
  const [resumeUrl, setResumeUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { if (profile) setResumeUrl(profile.resume_url || ''); }, [profile]);

  const handleUpload = async (file?: File) => {
    if (!file || !user) return;
    if (file.type !== 'application/pdf') return push('Please upload a PDF file', 'error');
    setUploading(true);
    const url = await uploadImage(file, user.id, 'resume');
    setUploading(false);
    if (url) { setResumeUrl(url); push('Resume uploaded.'); }
    else push('Upload failed', 'error');
  };

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from('profiles').update({ resume_url: resumeUrl }).eq('id', user.id);
    setBusy(false);
    if (error) return push(error.message, 'error');
    await refreshProfile();
    push('Resume link saved.');
  };

  return (
    <div>
      <SectionHeader title="Resume" desc="Upload your resume PDF or paste a link." />
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-6 animate-fade-up">
          <label className="label">Upload PDF</label>
          <label className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors hover:bg-[rgb(var(--bg-soft))]" style={{ borderColor: 'rgb(var(--border))' }}>
            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0])} />
            {uploading ? <Loader2 className="animate-spin mx-auto mb-3" style={{ color: 'rgb(var(--primary))' }} /> : <Upload size={28} className="mx-auto mb-3" style={{ color: 'rgb(var(--text-faint))' }} />}
            <p className="text-sm font-medium">{uploading ? 'Uploading...' : 'Click to upload your resume (PDF)'}</p>
          </label>
        </div>
        <div className="card p-6 space-y-4 animate-fade-up delay-1">
          <div>
            <label className="label">Resume URL</label>
            <input className="input" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://... or uploaded file URL" />
          </div>
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn btn-ghost text-sm w-full">
              <FileText size={16} /> Preview resume <ExternalLink size={13} className="opacity-60" />
            </a>
          )}
          <button onClick={save} disabled={busy} className="btn btn-primary disabled:opacity-60">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save resume
          </button>
        </div>
      </div>
    </div>
  );
}

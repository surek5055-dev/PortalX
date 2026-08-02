import { useState, FormEvent, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Shield, ArrowRight } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminLoginPage() {
  const { signIn, role, user, loading } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const pendingRef = useRef(false);

  useEffect(() => {
    if (!pendingRef.current || loading) return;
    pendingRef.current = false;
    if (role === 'admin') {
      push('Admin signed in.');
      navigate('/admin');
    } else {
      push('Signed in, but this account is not an admin.', 'error');
      navigate('/dashboard');
    }
  }, [role, loading, navigate, push]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) return push(error, 'error');
    pendingRef.current = true;
  };

  return (
    <AuthLayout
      title="Admin sign in"
      subtitle="Restricted area. Administrators only."
      footer={<>Not an admin? <Link to="/login" className="font-semibold" style={{ color: 'rgb(var(--primary))' }}>User login</Link></>}
    >
      <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl" style={{ background: 'rgb(var(--primary) / .08)', color: 'rgb(var(--primary))', border: '1px solid rgb(var(--primary) / .2)' }}>
        <Shield size={18} />
        <span className="text-xs font-medium">The first account created becomes the admin automatically.</span>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Admin email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--text-faint))' }} />
            <input type="email" className="input pl-10" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--text-faint))' }} />
            <input type="password" className="input pl-10" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>
        <button type="submit" disabled={busy} className="btn btn-primary w-full !py-3 disabled:opacity-60">
          {busy ? <Loader2 size={18} className="animate-spin" /> : <>Sign in as admin <ArrowRight size={16} /></>}
        </button>
      </form>
      {user && role && <p className="mt-4 text-xs text-center" style={{ color: 'rgb(var(--text-faint))' }}>Current session role: {role}</p>}
    </AuthLayout>
  );
}

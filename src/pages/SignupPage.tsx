import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function SignupPage() {
  const { signUp } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return push('Password must be at least 6 characters', 'error');
    setBusy(true);
    const { error } = await signUp(email.trim(), password, name.trim());
    setBusy(false);
    if (error) return push(error, 'error');
    push('Account created! You are signed in.');
    navigate('/dashboard');
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start building your portfolio in minutes."
      footer={<>Already have an account? <Link to="/login" className="font-semibold" style={{ color: 'rgb(var(--primary))' }}>Sign in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Full name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--text-faint))' }} />
            <input className="input pl-10" placeholder="Jane Designer" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--text-faint))' }} />
            <input type="email" className="input pl-10" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--text-faint))' }} />
            <input type="password" className="input pl-10" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>
        <button type="submit" disabled={busy} className="btn btn-primary w-full !py-3 disabled:opacity-60">
          {busy ? <Loader2 size={18} className="animate-spin" /> : <>Create account <ArrowRight size={16} /></>}
        </button>
        <p className="text-xs text-center" style={{ color: 'rgb(var(--text-faint))' }}>
          By signing up you agree to our terms & privacy policy.
        </p>
      </form>
    </AuthLayout>
  );
}

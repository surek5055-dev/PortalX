import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <FullLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, role, loading } = useAuth();
  if (loading) return <FullLoader />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export function FullLoader() {
  return (
    <div className="min-h-screen grid place-items-center mesh-bg">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'rgb(var(--primary))' }} />
    </div>
  );
}

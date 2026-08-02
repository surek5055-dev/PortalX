import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

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
      <div className="flex flex-col items-center gap-5">
        <div className="animate-pulse"><Logo size="lg" /></div>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgb(var(--primary))', borderTopColor: 'transparent' }} />
      </div>
    </div>
  );
}

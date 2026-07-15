import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAdminSession } from '../hooks/useAdminSession';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAdminSession();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Chargement…</div>;
  }
  if (!isAdmin) {
    return <Navigate to="/admin/connexion" replace />;
  }
  return <>{children}</>;
}

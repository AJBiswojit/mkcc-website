import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';

export default function AdminLayout() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-mkcc-black flex items-center justify-center">
        <div className="text-mkcc-gold font-display text-3xl tracking-widest animate-pulse">MKCC ADMIN...</div>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen bg-mkcc-black">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

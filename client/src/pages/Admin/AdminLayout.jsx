import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';

export default function AdminLayout() {
  const { isAdmin, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-mkcc-black flex items-center justify-center">
        <div className="text-mkcc-gold font-display text-3xl tracking-widest animate-pulse">
          MKCC ADMIN...
        </div>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen bg-mkcc-black">
      {/* Sidebar — handles its own backdrop + slide animation */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 md:ml-64 min-h-screen">

        {/* ── Mobile top bar with hamburger ── */}
        <div className="md:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-mkcc-dark border-b border-mkcc-border">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col justify-center items-center w-10 h-10 rounded-lg border border-mkcc-border bg-mkcc-card hover:border-mkcc-gold transition-colors focus:outline-none gap-1.5"
            aria-label="Open sidebar"
          >
            <span className="block w-5 h-0.5 bg-white rounded-full" />
            <span className="block w-5 h-0.5 bg-white rounded-full" />
            <span className="block w-5 h-0.5 bg-white rounded-full" />
          </button>

          {/* Logo text */}
          <span className="font-display text-lg text-mkcc-gold uppercase tracking-widest">MKCC</span>
          <span className="font-heading text-[10px] text-mkcc-red uppercase tracking-widest mt-1">Admin</span>
        </div>

        {/* Page content */}
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
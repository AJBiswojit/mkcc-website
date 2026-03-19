import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';

// ─── Scroll To Top on every page change ──────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import Home    from './pages/Home/Home';
import About   from './pages/About/About';
import Team    from './pages/Team/Team';
import Events  from './pages/Events/Events';
import Gallery from './pages/Gallery/Gallery';
import Contact from './pages/Contact/Contact';
import Donate  from './pages/Donate/Donate';
import GaneshPuja from './pages/GaneshPuja/GaneshPuja';

import AdminLogin       from './pages/Admin/AdminLogin';
import AdminLayout      from './pages/Admin/AdminLayout';
import AdminDashboard   from './pages/Admin/AdminDashboard';
import AdminEvents      from './pages/Admin/AdminEvents';
import { AdminTeam }    from './pages/Admin/AdminTeam';
import { AdminGallery, AdminMembers, AdminAnnouncements, AdminDonations } from './pages/Admin/AdminOther';

const PageWrap = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Public layout wrapper — Navbar + page content + Footer
function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1A1A',
              color: '#F0F0F0',
              border: '1px solid #2A2A2A',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
            },
            success: { iconTheme: { primary: '#D4AF37', secondary: '#0A0A0A' } },
            error:   { iconTheme: { primary: '#C41E3A', secondary: '#F0F0F0' } },
          }}
        />
        <Routes>

          {/* ── Admin routes ─────────────────────────────── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index                  element={<AdminDashboard />} />
            <Route path="events"          element={<AdminEvents />} />
            <Route path="team"            element={<AdminTeam />} />
            <Route path="gallery"         element={<AdminGallery />} />
            <Route path="members"         element={<AdminMembers />} />
            <Route path="announcements"   element={<AdminAnnouncements />} />
            <Route path="donations"       element={<AdminDonations />} />
          </Route>

          {/* ── Public routes ────────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/"        element={<PageWrap><Home /></PageWrap>} />
            <Route path="/about"   element={<PageWrap><About /></PageWrap>} />
            <Route path="/team"    element={<PageWrap><Team /></PageWrap>} />
            <Route path="/events"  element={<PageWrap><Events /></PageWrap>} />
            <Route path="/gallery" element={<PageWrap><Gallery /></PageWrap>} />
            <Route path="/contact" element={<PageWrap><Contact /></PageWrap>} />
            <Route path="/donate"  element={<PageWrap><Donate /></PageWrap>} />
            <Route path="/ganesh-puja" element={<PageWrap><GaneshPuja /></PageWrap>} />
            <Route path="*"        element={<PageWrap><NotFound /></PageWrap>} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Simple 404 page
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
      <div className="font-display text-[8rem] text-mkcc-red leading-none">404</div>
      <h2 className="font-heading font-bold text-white text-3xl mt-2">Page Not Found</h2>
      <p className="text-mkcc-muted font-body mt-3 mb-8">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">← Back to Home</a>
    </div>
  );
}

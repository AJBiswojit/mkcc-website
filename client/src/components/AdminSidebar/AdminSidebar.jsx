import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MKCCLogo from '../Logo/MKCCLogo';

const NAV = [
  { path: '/admin',                label: 'Dashboard',     icon: '📊' },
  { path: '/admin/events',         label: 'Events',        icon: '📅' },
  { path: '/admin/gallery',        label: 'Gallery',       icon: '🖼️' },
  { path: '/admin/team',           label: 'Team',          icon: '👥' },
  { path: '/admin/members',        label: 'Membership',    icon: '📋' },
  { path: '/admin/announcements',  label: 'Announcements', icon: '📢' },
  { path: '/admin/donations',      label: 'Donations',     icon: '💛' },
];

export default function AdminSidebar({ isOpen = false, onClose = () => {} }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                              // clears token + user state
    navigate('/', { replace: true });      // replace entire history stack — back button won't return to admin
  };

  return (
    <>
      {/* Backdrop — mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          w-64 bg-mkcc-dark border-r border-mkcc-border
          flex flex-col h-full min-h-screen
          fixed left-0 top-0 z-40
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className="p-5 border-b border-mkcc-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MKCCLogo size={40} />
            <div>
              <div className="font-display text-lg text-mkcc-gold tracking-widest">MKCC</div>
              <div className="font-heading text-[10px] text-mkcc-red uppercase tracking-widest">Admin Panel</div>
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="md:hidden text-mkcc-muted hover:text-white transition-colors text-xl leading-none"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* User */}
        <div className="px-5 py-3 border-b border-mkcc-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-mkcc-red rounded-full flex items-center justify-center text-white font-heading font-bold text-sm">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="font-heading text-white text-sm font-semibold">{user?.username || 'Admin'}</p>
              <p className="text-mkcc-muted text-xs capitalize">{user?.role || 'admin'}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {NAV.map(({ path, label, icon }) => {
            const active = pathname === path || (path !== '/admin' && pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={`flex items-center gap-3 px-5 py-3 font-heading font-semibold text-sm transition-all
                  ${active
                    ? 'bg-mkcc-red/10 text-mkcc-red border-l-2 border-mkcc-red'
                    : 'text-mkcc-muted hover:text-white hover:bg-mkcc-card border-l-2 border-transparent'
                  }`}
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-mkcc-border space-y-2">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2 text-mkcc-muted hover:text-white font-heading text-sm px-3 py-2 rounded hover:bg-mkcc-card transition-colors"
          >
            <span>🌐</span> View Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-mkcc-red hover:bg-mkcc-red/10 font-heading text-sm px-3 py-2 rounded transition-colors"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </div>
    </>
  );
}
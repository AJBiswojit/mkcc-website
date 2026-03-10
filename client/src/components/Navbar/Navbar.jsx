import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MKCCLogo from '../Logo/MKCCLogo';

const NAV_LINKS = [
  { label: 'Home',    path: '/' },
  { label: 'About',   path: '/about' },
  { label: 'Team',    path: '/team' },
  { label: 'Events',  path: '/events' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-mkcc-black/95 backdrop-blur-md border-b border-mkcc-border shadow-lg shadow-black/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <MKCCLogo size={44} className="group-hover:drop-shadow-[0_0_8px_rgba(196,30,58,0.8)] transition-all duration-300" />
            <div className="hidden sm:block">
              <div className="font-display text-xl text-mkcc-gold leading-none tracking-widest">MKCC</div>
              <div className="font-heading text-[10px] text-mkcc-muted tracking-[0.15em] uppercase">Maa Kali Cricket Club</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`relative font-heading font-semibold text-sm uppercase tracking-widest px-4 py-2 transition-colors duration-200
                    ${location.pathname === path ? 'text-mkcc-gold' : 'text-gray-300 hover:text-white'}`}
                >
                  {label}
                  {location.pathname === path && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-mkcc-red rounded-full"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/donate"
              className="flex items-center gap-1.5 font-heading font-bold text-sm uppercase tracking-widest px-4 py-2 rounded-lg bg-mkcc-gold/10 border border-mkcc-gold/40 text-mkcc-gold hover:bg-mkcc-gold/20 hover:border-mkcc-gold transition-all duration-200">
              💛 Donate
            </Link>
            <Link to="/contact#join" className="btn-primary text-sm py-2 px-5">
              Join Us 🏏
            </Link>
            <Link
              to="/admin"
              title="Admin Panel"
              className="w-9 h-9 flex items-center justify-center rounded border border-mkcc-border text-mkcc-muted hover:text-mkcc-gold hover:border-mkcc-gold transition-all duration-200"
            >
              <span className="text-base leading-none">⚙️</span>
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
              className="block w-6 h-0.5 bg-mkcc-gold origin-center transition-all" />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1 }}
              className="block w-6 h-0.5 bg-mkcc-gold" />
            <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
              className="block w-6 h-0.5 bg-mkcc-gold origin-center transition-all" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-mkcc-black/98 backdrop-blur-md md:hidden pt-20"
          >
            <ul className="flex flex-col items-center gap-2 p-8">
              {NAV_LINKS.map(({ label, path }, i) => (
                <motion.li
                  key={path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="w-full text-center"
                >
                  <Link
                    to={path}
                    className={`block font-display text-4xl tracking-widest py-3 transition-colors duration-200
                      ${location.pathname === path ? 'text-mkcc-gold' : 'text-white hover:text-mkcc-red'}`}
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
              <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 w-full px-6">
                <Link to="/donate" className="btn-gold text-base w-full text-center block py-4">
                  💛 Donate to MKCC
                </Link>
              </motion.li>
              <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="w-full px-6">
                <Link to="/contact#join" className="btn-primary text-base w-full text-center block py-4">
                  Join MKCC 🏏
                </Link>
              </motion.li>
              <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="w-full px-6 pb-8">
                <Link to="/admin"
                  className="flex items-center justify-center gap-2 text-mkcc-muted hover:text-mkcc-gold font-heading text-sm uppercase tracking-widest py-3 border border-mkcc-border rounded-lg transition-colors w-full">
                  ⚙️ Admin Panel
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

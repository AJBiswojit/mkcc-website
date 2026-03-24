import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MKCCLogo from '../Logo/MKCCLogo';
import api from '../../utils/api';

export default function Footer() {
  const [visitors, setVisitors] = useState(null);

  useEffect(() => {
    const lastVisit = localStorage.getItem('mkcc_visited');
    const today = new Date().toDateString();

    if (lastVisit !== today) {
      // New visitor or new day — count it
      api.post('/visitor/hit')
        .then(r => setVisitors(r.data.count))
        .catch(() => { });
      localStorage.setItem('mkcc_visited', today);
    } else {
      // Already visited today — just get count
      api.get('/visitor/count')
        .then(r => setVisitors(r.data.count))
        .catch(() => { });
    }
  }, []);
  return (
    <footer className="bg-mkcc-black border-t border-mkcc-border mt-0">
      {/* Divider */}
      <div className="divider-red" />

      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <MKCCLogo size={52} />
            <div>
              <div className="font-display text-2xl text-mkcc-gold tracking-widest">MKCC</div>
              <div className="font-heading text-xs text-mkcc-muted tracking-widest uppercase">Maa Kali Cricket Club</div>
            </div>
          </div>
          <p className="text-mkcc-muted text-sm font-body leading-relaxed">
            Where Cricket Meets Culture and Unity. Est.1998 in Patuli, Olaver, Odisha.
          </p>
          {/* WhatsApp */}
          <a
            href="https://wa.me/9777714998?text=Hi%20MKCC!%20I%20want%20to%20join%20the%20club."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-heading text-sm font-semibold px-4 py-2 rounded transition-colors"
          >
            <span>💬</span> Join WhatsApp Group
          </a>
        </div>

        <div>
          <h4 className="font-heading font-bold text-white text-lg uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {['Home', 'About', 'Team', 'Events', 'Gallery', 'Contact'].map(label => (
              <li key={label}>
                <Link to={`/${label === 'Home' ? '' : label.toLowerCase()}`}
                  className="text-mkcc-muted hover:text-mkcc-gold font-body text-sm transition-colors">
                  → {label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-mkcc-border mt-2">
              <Link to="/donate"
                className="text-mkcc-gold hover:text-mkcc-gold/80 font-body text-sm font-semibold transition-colors flex items-center gap-1">
                💛 Donate to MKCC
              </Link>
            </li>
            <li>
              <Link to="/admin"
                className="text-mkcc-muted hover:text-mkcc-red font-body text-sm transition-colors flex items-center gap-1">
                ⚙️ Admin Panel
              </Link>
            </li>
          </ul>
        </div>

        {/* Events */}
        <div>
          <h4 className="font-heading font-bold text-white text-lg uppercase tracking-wider mb-4">Upcoming</h4>
          <ul className="space-y-3">
            <li>
              <p className="text-mkcc-gold font-heading text-sm font-semibold">Ganesh Puja 2026</p>
              <p className="text-mkcc-muted text-xs">Patuli Village Square · 2026</p>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading font-bold text-white text-lg uppercase tracking-wider mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-mkcc-muted font-body">
            <li className="flex items-start gap-2"><span>📍</span><span>Patuli, Olaver, Odisha, India</span></li>
            <li className="flex items-center gap-2"><span>📞</span><span>+91 ***** *****</span></li>
            <li className="flex items-center gap-2"><span>✉️</span><span>web.mkccpatuli@gmail.com</span></li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a href="#"
              target="_blank"
              className="w-9 h-9 bg-mkcc-card border border-mkcc-border rounded flex items-center justify-center text-mkcc-muted hover:text-mkcc-red hover:border-mkcc-red transition-colors">FB</a>
            <a href="https://youtube.com/@mkccpatulivlog?si=6uIIFE6H9FnXjBC1"
              target="_blank"
              className="w-9 h-9 bg-mkcc-card border border-mkcc-border rounded flex items-center justify-center text-mkcc-muted hover:text-mkcc-red hover:border-mkcc-red transition-colors">YT</a>
            <a href="https://www.instagram.com/mkcc.patuli?igsh=MXhhNjU0eWRrOWNhYw=="
              target="_blank"
              className="w-9 h-9 bg-mkcc-card border border-mkcc-border rounded flex items-center justify-center text-mkcc-muted hover:text-mkcc-gold hover:border-mkcc-gold transition-colors">IG</a>
          </div>
        </div>
      </div>

      <div className="divider-gold opacity-30" />
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-mkcc-muted text-xs font-body tracking-wide text-center">
          © {new Date().getFullYear()} MKCC — Maa Kali Cricket Club, Patuli, Olaver, Odisha.
          <span className="text-mkcc-red ml-1">🏏 Jai Maa Kali!</span>
        </p>
        {visitors !== null && (
          <div className="flex items-center gap-2 bg-mkcc-card border border-mkcc-border rounded-full px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="font-heading text-xs text-mkcc-muted uppercase tracking-wider">
              Visitors
            </span>
            <span className="font-display text-mkcc-gold text-sm">
              {visitors.toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>
    </footer>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import MKCCLogo from '../../components/Logo/MKCCLogo';
import EventCard from '../../components/EventCard/EventCard';
import GalleryGrid from '../../components/GalleryGrid/GalleryGrid';
import api from '../../utils/api';

// ─── Section Wrapper ──────────────────────────────────────────────────────────
const Section = ({ id, children, className = '' }) => (
  <section id={id} className={`py-20 ${className}`}>{children}</section>
);
const SectionHead = ({ label, title, subtitle }) => (
  <div className="text-center mb-12">
    <span className="font-heading text-mkcc-red text-sm uppercase tracking-[0.3em] font-semibold">{label}</span>
    <h2 className="section-title mt-1">{title}</h2>
    {subtitle && <p className="section-subtitle mt-2 max-w-xl mx-auto">{subtitle}</p>}
    <div className="divider-red w-24 mx-auto mt-4" />
  </div>
);

// ─── Announcement Ticker ──────────────────────────────────────────────────────
function AnnouncementTicker({ items }) {
  if (!items.length) return null;
  const text = items.map(a => `📢 ${a.title}`).join('    ★    ');
  return (
    <div className="bg-mkcc-red/10 border-y border-mkcc-red/30 py-2.5 overflow-hidden">
      <div className="flex items-center gap-4">
        <span className="flex-shrink-0 bg-mkcc-red px-4 py-1 font-heading font-bold text-white text-sm uppercase tracking-widest">
          Breaking
        </span>
        <div className="ticker-wrapper flex-1">
          <div className="ticker-content font-heading text-mkcc-gold text-sm font-medium tracking-wide">
            {text} &nbsp;&nbsp;&nbsp; {text}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '27+', label: 'Years Strong' },
  { value: '14+', label: 'Active Players' },
  { value: '65+', label: 'Trophies Won' },
  { value: '150+', label: 'Community Members' },
];

export default function Home() {
  const [events, setEvents]           = useState([]);
  const [announcements, setAnn]       = useState([]);
  const [gallery, setGallery]         = useState([]);
  const [donorStats, setDonorStats]   = useState({ totalAmount: 0, totalDonors: 0 });
  const [recentDonors, setRecentDonors] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', village: '', role: 'Player' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/events?status=upcoming').then(r => setEvents(r.data.data)).catch(() => {});
    api.get('/announcements').then(r => setAnn(r.data.data)).catch(() => {});
    api.get('/gallery').then(r => setGallery(r.data.data.slice(0, 6))).catch(() => {});
    api.get('/donations/stats').then(r => setDonorStats(r.data.data)).catch(() => {});
    api.get('/donations/recent').then(r => setRecentDonors(r.data.data)).catch(() => {});

    // Auto-refresh donors every 30 seconds to stay "live"
    const interval = setInterval(() => {
      api.get('/donations/stats').then(r => setDonorStats(r.data.data)).catch(() => {});
      api.get('/donations/recent').then(r => setRecentDonors(r.data.data)).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/join', form);
      toast.success('🏏 Request submitted! We will contact you soon.');
      setForm({ name: '', phone: '', village: '', role: 'Player' });
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);

  return (
    <div className="overflow-x-hidden">
      {/* ── Announcement Ticker ── */}
      <div className="pt-16 md:pt-20">
        <AnnouncementTicker items={announcements} />
      </div>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center bg-hero-pattern overflow-hidden">
        {/* Background radial */}
        <div className="absolute inset-0 bg-gradient-radial from-mkcc-crimson/20 via-transparent to-transparent" 
          style={{ background: 'radial-gradient(ellipse at center top, rgba(139,0,0,0.25) 0%, transparent 65%)' }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(196,30,58,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(196,30,58,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 0.8 }}
            className="flex justify-center mb-6"
          >
            <MKCCLogo size={120} className="drop-shadow-[0_0_30px_rgba(196,30,58,0.6)]" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
            <p className="font-heading text-mkcc-red text-sm uppercase tracking-[0.4em] font-semibold mb-3">
              Est.1998 · Patuli · Olaver · Odisha
            </p>
            <h1 className="font-display text-[clamp(3.5rem,10vw,8rem)] leading-none text-white uppercase tracking-wider">
              MAA KALI<br />
              <span className="text-gradient-gold">CRICKET</span><br />
              <span className="text-mkcc-red">CLUB</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="font-heading text-gray-300 text-xl md:text-2xl mt-6 italic tracking-wide"
          >
            "Where Cricket Meets Culture and Unity"
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <Link to="/events" className="btn-primary text-base">View Events 🏆</Link>
            <Link to="/team" className="btn-outline text-base">Meet The Team</Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mt-16 flex flex-col items-center text-mkcc-muted"
          >
            <span className="text-xs font-heading uppercase tracking-widest mb-2">Scroll Down</span>
            <div className="w-px h-10 bg-gradient-to-b from-mkcc-red to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="bg-mkcc-red py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 relative">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-5xl text-white">{value}</div>
              <div className="font-heading text-white/80 text-sm uppercase tracking-wider mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <Section id="about" className="bg-mkcc-dark">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="font-heading text-mkcc-red text-sm uppercase tracking-[0.3em] font-semibold">Our Story</span>
            <h2 className="section-title mt-1 mb-6">About<br /><span className="text-gradient-gold">MKCC</span></h2>
            <p className="font-body text-gray-300 leading-relaxed mb-4">
              Maa Kali Cricket Club (MKCC) was born from the heart of Patuli village in Olaver, Odisha — a place where cricket is not just a sport, but a passion that unites generations.
            </p>
            <p className="font-body text-gray-400 leading-relaxed mb-6">
              Under the blessings of Maa Kali, our club brings together young talent, nurtures sporting excellence, and celebrates the rich cultural heritage of our village through cricket and grand events like Ganesh Puja.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/about" className="btn-primary">Our Full Story</Link>
              <Link to="/contact#join" className="btn-outline">Join MKCC</Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: '🏏', title: 'Cricket Excellence', desc: 'The King of Night Match' },
              { icon: '🪔', title: 'Cultural Roots', desc: 'Annual Ganesh Puja & cultural celebrations' },
              { icon: '🤝', title: 'Village Unity', desc: 'Bringing Patuli community together' },
              { icon: '🌱', title: 'Youth Development', desc: 'Nurturing next-gen sporting talent' },
            ].map(({ icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.2 }}
                className="card-gold bg-mkcc-card rounded-xl p-5"
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h4 className="font-heading font-bold text-white text-base">{title}</h4>
                <p className="text-mkcc-muted text-sm mt-1 font-body">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── UPCOMING EVENTS ── */}
      <Section id="events" className="bg-mkcc-black">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="What's Coming" title="Upcoming Events" subtitle="Don't miss the action — MKCC has exciting events lined up!" />
          {upcomingEvents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((ev, i) => <EventCard key={ev._id} event={ev} delay={i * 0.1} />)}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-mkcc-border rounded-2xl">
              <div className="text-5xl mb-3">📅</div>
              <p className="font-heading text-white text-xl font-semibold">No Upcoming Events</p>
              <p className="text-mkcc-muted font-body text-sm mt-2">Check back soon — exciting events are being planned!</p>
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/events" className="btn-gold">View All Events →</Link>
          </div>
        </div>
      </Section>

      {/* ── DONATE + LIVE DONORS ── */}
      <Section className="bg-mkcc-dark">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHead
            label="Support Our Club"
            title="Help Us Grow"
            subtitle="Your contribution powers cricket, culture, and community in Patuli, Olaver."
          />

          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* Left — Donate CTA */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-mkcc-gold/10 via-mkcc-card to-mkcc-red/10 border border-mkcc-gold/30 rounded-3xl p-8 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-mkcc-gold/5 rounded-full translate-x-10 -translate-y-10 pointer-events-none" />
              <div className="relative">
                <div className="text-5xl mb-4">💛</div>
                <h3 className="font-display text-4xl text-white uppercase mb-3">Donate From Your Haert❤</h3>
                <p className="text-gray-400 font-body text-base mb-6 leading-relaxed">
                  Scan the UPI QR, pay any amount, and your name will appear live on this page!
                </p>

                {/* Live counter */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-mkcc-dark border border-mkcc-red/30 rounded-xl p-4 text-center">
                    <p className="font-display text-3xl text-mkcc-gold">
                      ₹{donorStats.totalAmount?.toLocaleString('en-IN') || '0'}
                    </p>
                    <p className="font-heading text-mkcc-muted text-xs uppercase tracking-wider mt-1">Total Raised</p>
                  </div>
                  <div className="bg-mkcc-dark border border-mkcc-gold/30 rounded-xl p-4 text-center">
                    <p className="font-display text-3xl text-mkcc-gold">
                      {donorStats.totalDonors || 0}
                    </p>
                    <p className="font-heading text-mkcc-muted text-xs uppercase tracking-wider mt-1">Proud Donors</p>
                  </div>
                </div>

                <Link to="/donate" className="btn-gold w-full text-center text-base py-3 block">
                  💛 Donate to MKCC →
                </Link>
              </div>
            </motion.div>

            {/* Right — Live Donors Board */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-mkcc-card border border-mkcc-border rounded-3xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-mkcc-border bg-mkcc-dark/50">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                  <h3 className="font-heading font-bold text-white text-base uppercase tracking-wider">Live Donors</h3>
                </div>
                <span className="font-heading text-mkcc-muted text-xs uppercase tracking-wider">
                  {recentDonors.length > 0 ? `${recentDonors.length} recent` : 'Be the first!'}
                </span>
              </div>

              {/* Donors list */}
              {recentDonors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="text-5xl mb-3">🏆</div>
                  <p className="font-heading font-bold text-white text-lg">Be the First Donor!</p>
                  <p className="text-mkcc-muted font-body text-sm mt-1">Your name will shine here after donation.</p>
                  <Link to="/donate" className="btn-primary text-sm py-2 mt-4">Donate Now →</Link>
                </div>
              ) : (
                <div className="divide-y divide-mkcc-border/50">
                  {recentDonors.map((donor, i) => (
                    <motion.div
                      key={donor._id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-mkcc-dark/40 transition-colors"
                    >
                      {/* Rank badge */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-display text-lg flex-shrink-0
                        ${i === 0 ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400' :
                          i === 1 ? 'bg-gray-400/20 border border-gray-400/40 text-gray-300' :
                          i === 2 ? 'bg-amber-700/20 border border-amber-700/40 text-amber-600' :
                                    'bg-mkcc-red/10 border border-mkcc-red/20 text-mkcc-gold'}`}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : donor.name[0]?.toUpperCase()}
                      </div>

                      {/* Name + message */}
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-white truncate">
                          {donor.name}
                        </p>
                        {donor.message ? (
                          <p className="text-mkcc-muted text-xs font-body italic truncate">"{donor.message}"</p>
                        ) : (
                          <p className="text-mkcc-muted text-xs font-body">
                            {new Date(donor.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </div>

                      {/* Amount */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-display text-mkcc-gold text-xl">₹{donor.amount?.toLocaleString('en-IN')}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Footer */}
              {recentDonors.length > 0 && (
                <div className="px-6 py-3 border-t border-mkcc-border bg-mkcc-dark/30 text-center">
                  <Link to="/donate" className="font-heading text-mkcc-gold hover:text-white text-sm transition-colors">
                    💛 Join these amazing donors →
                  </Link>
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </Section>
      <Section id="gallery" className="bg-mkcc-dark">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead label="Moments Captured" title="Photo Gallery" subtitle="Reliving the best moments of MKCC cricket & cultural celebrations" />
          {gallery.length > 0 ? (
            <GalleryGrid photos={gallery} />
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-mkcc-border rounded-2xl">
              <div className="text-5xl mb-3">📸</div>
              <p className="font-heading text-white text-xl font-semibold">Gallery Coming Soon</p>
              <p className="text-mkcc-muted font-body text-sm mt-2">Photos will appear here once uploaded by the admin.</p>
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/gallery" className="btn-outline">View Full Gallery →</Link>
          </div>
        </div>
      </Section>

      {/* ── JOIN MKCC ── */}
      <Section id="join" className="bg-mkcc-black">
        <div className="max-w-2xl mx-auto px-6">
          <SectionHead label="Be the part of our Family" title="Join MKCC" subtitle="Fill the form below and become a member of Maa Kali Cricket Club" />
          <motion.form
            onSubmit={handleJoin}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-glow bg-mkcc-card rounded-2xl p-8 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-heading text-gray-300 text-sm mb-1.5 uppercase tracking-wider">Full Name *</label>
                <input type="text" required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body focus:border-mkcc-red focus:outline-none focus:ring-1 focus:ring-mkcc-red transition-colors"
                />
              </div>
              <div>
                <label className="block font-heading text-gray-300 text-sm mb-1.5 uppercase tracking-wider">Phone *</label>
                <input type="tel" required value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body focus:border-mkcc-red focus:outline-none focus:ring-1 focus:ring-mkcc-red transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block font-heading text-gray-300 text-sm mb-1.5 uppercase tracking-wider">Village</label>
              <input type="text" value={form.village}
                onChange={e => setForm(f => ({ ...f, village: e.target.value }))}
                placeholder="Your village name"
                className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body focus:border-mkcc-red focus:outline-none focus:ring-1 focus:ring-mkcc-red transition-colors"
              />
            </div>
            <div>
              <label className="block font-heading text-gray-300 text-sm mb-1.5 uppercase tracking-wider">Role</label>
              <select value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body focus:border-mkcc-red focus:outline-none focus:ring-1 focus:ring-mkcc-red transition-colors"
              >
                <option value="Player">🏏 Player</option>
                <option value="Member">👥 Member</option>
                <option value="Volunteer">🙌 Volunteer</option>
              </select>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full text-center justify-center text-base">
              {submitting ? 'Submitting...' : '🏏 Submit Request'}
            </button>
          </motion.form>

          {/* WhatsApp */}
        </div>
      </Section>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const FadeIn = ({ children, delay = 0, className = '' }) => (
  <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} transition={{ duration: 0.6, delay }} className={className}>
    {children}
  </motion.div>
);

const CONTACT_INFO = [
  { icon: '📍', label: 'Address', value: 'Patuli, Olaver, Odisha, India' },
  { icon: '📞', label: 'Phone', value: '+91 ***** *****', href: 'tel:+************' },
  { icon: '✉️', label: 'Email', value: 'mkcc.patuli@gmail.com', href: 'mailto:mkcc.patuli@gmail.com' },
  { icon: '💬', label: 'Instagram', value: 'Follow Our Instagram', href: 'https://www.instagram.com/mkcc.patuli?igsh=MXhhNjU0eWRrOWNhYw==' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', village: '', role: 'Player', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState('join'); // join | contact

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/join', form);
      toast.success('🏏 Request submitted successfully! We\'ll contact you soon.');
      setForm({ name: '', phone: '', village: '', role: 'Player', message: '' });
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative bg-mkcc-dark py-20 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(196,30,58,0.15) 0%, transparent 60%)' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="font-heading text-mkcc-red text-sm uppercase tracking-[0.3em]">Get In Touch</span>
          <h1 className="font-display text-7xl md:text-8xl text-white mt-2 uppercase">
            <span className="text-gradient-gold">Contact</span> Us
          </h1>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12">
        {/* Left — Info */}
        <div className="space-y-8">
          {/* Contact Cards */}
          <FadeIn>
            <h2 className="font-display text-4xl text-white uppercase mb-6">Find Us</h2>
            <div className="space-y-4">
              {CONTACT_INFO.map(({ icon, label, value, href }, i) => (
                <motion.div key={label}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="card-glow bg-mkcc-card rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-mkcc-red/10 border border-mkcc-red/30 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="font-heading text-mkcc-muted text-xs uppercase tracking-wider">{label}</p>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer"
                        className="font-heading font-semibold text-white hover:text-mkcc-gold transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="font-heading font-semibold text-white">{value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* Map */}
          <FadeIn delay={0.2}>
            <h3 className="font-heading font-bold text-white text-xl mb-4 uppercase tracking-wider">Location</h3>
            <div className="rounded-xl overflow-hidden card-glow h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.5!2d86.6606726!3d20.7325231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1b9500789edead%3A0xbe268b7c0ebf0a07!2sPMM6%2B26%20M.K.C.C%20patuli!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MKCC Location"
              />
            </div>
          </FadeIn>

          {/* WhatsApp */}
          <FadeIn delay={0.3}>
            <a href="https://wa.me/9777714998?text=Hi%20MKCC!%20NEED%20UPDATE" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 bg-green-900/30 border border-green-700/50 rounded-xl p-5 hover:bg-green-900/50 transition-colors group">
              <span className="text-4xl">💬</span>
              <div>
                <p className="font-heading font-bold text-white text-lg">Contact MKCC WhatsApp Group</p>
                <p className="text-green-400 text-sm font-body">Get updates, match schedules & announcements</p>
              </div>
              <span className="ml-auto text-green-400 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </FadeIn>
        </div>

        {/* Right — Form */}
        <FadeIn delay={0.2}>
          <div id="join" className="card-glow bg-mkcc-card rounded-2xl p-8">
            {/* Tab */}
            <div className="flex bg-mkcc-dark rounded-lg p-1 border border-mkcc-border mb-6">
              {[['join', '🏏 Join MKCC'], ['contact', '📬 Contact']].map(([val, label]) => (
                <button key={val} onClick={() => setTab(val)}
                  className={`flex-1 font-heading font-semibold text-sm uppercase tracking-wider py-2 rounded transition-all
                    ${tab === val ? 'bg-mkcc-red text-white' : 'text-mkcc-muted hover:text-white'}`}>
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading text-gray-300 text-xs mb-1.5 uppercase tracking-wider">Name *</label>
                  <input type="text" required value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body text-sm focus:border-mkcc-red focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block font-heading text-gray-300 text-xs mb-1.5 uppercase tracking-wider">Phone *</label>
                  <input type="tel" required value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body text-sm focus:border-mkcc-red focus:outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label className="block font-heading text-gray-300 text-xs mb-1.5 uppercase tracking-wider">Village</label>
                <input type="text" value={form.village}
                  onChange={e => setForm(f => ({ ...f, village: e.target.value }))}
                  placeholder="Your village name"
                  className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body text-sm focus:border-mkcc-red focus:outline-none transition-colors" />
              </div>

              {tab === 'join' && (
                <div>
                  <label className="block font-heading text-gray-300 text-xs mb-1.5 uppercase tracking-wider">Role</label>
                  <select value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body text-sm focus:border-mkcc-red focus:outline-none transition-colors">
                    <option value="Player">🏏 Player</option>
                    <option value="Member">👥 Member</option>
                    <option value="Volunteer">🙌 Volunteer</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-heading text-gray-300 text-xs mb-1.5 uppercase tracking-wider">Message</label>
                <textarea value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder={tab === 'join' ? 'Tell us about yourself...' : 'Your message...'}
                  rows={4}
                  className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body text-sm focus:border-mkcc-red focus:outline-none transition-colors resize-none" />
              </div>

              <button type="submit" disabled={submitting}
                className="btn-primary w-full text-center text-base">
                {submitting ? 'Sending...' : tab === 'join' ? '🏏 Submit Your Request' : '📬 Send Message'}
              </button>
            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

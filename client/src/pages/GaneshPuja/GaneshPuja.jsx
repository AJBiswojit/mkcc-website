import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import ImageUpload from '../../components/ImageUpload/ImageUpload';

// ─── Puja Date ────────────────────────────────────────────────────────────────
const PUJA_START = new Date('2026-09-14T06:00:00');
const PUJA_END   = new Date('2026-09-20T22:00:00');
const PUJA_VENUE = 'Patuli Village, Olaver, Odisha';

// ─── 7-Day Programme ──────────────────────────────────────────────────────────
const PROGRAMME = [
  {
    day: 1, date: 'Sep 14', title: 'Pratistha & Sthapana', color: 'from-yellow-600 to-yellow-400',
    events: [
      { time: '5:00 AM', name: 'Mangal Snan & Puja Preparation' },
      { time: '8:00 AM', name: 'Ganesh Pratistha (Idol Installation)' },
      { time: '11:00 AM', name: 'Puja Arambh' },
      { time: '6:00 PM', name: 'Sandhya Aarti & Bhajan' },
      { time: '8:00 PM', name: 'Cultural Programme — Day 1' },
    ],
  },
  {
    day: 2, date: 'Sep 15', title: 'Bhajan & Kirtan', color: 'from-orange-600 to-orange-400',
    events: [
      { time: '6:00 AM', name: 'Pratah Puja & Aarti' },
      { time: '10:00 AM', name: 'Special Abhishek' },
      { time: '4:00 PM', name: 'Bhajan Sandhya' },
      { time: '8:00 PM', name: 'Kirtan Night — Local Artists' },
    ],
  },
  {
    day: 3, date: 'Sep 16', title: 'Cultural Night', color: 'from-red-600 to-red-400',
    events: [
      { time: '6:00 AM', name: 'Pratah Puja' },
      { time: '11:00 AM', name: 'Community Feast (Mahaprasad)' },
      { time: '5:00 PM', name: 'Children Cultural Programme' },
      { time: '8:00 PM', name: 'Grand Cultural Night' },
    ],
  },
  {
    day: 4, date: 'Sep 17', title: 'Cricket Tournament', color: 'from-green-600 to-green-400',
    events: [
      { time: '6:00 AM', name: 'Pratah Puja' },
      { time: '9:00 AM', name: 'MKCC Cricket Exhibition Match' },
      { time: '4:00 PM', name: 'Prize Distribution' },
      { time: '8:00 PM', name: 'Music Night' },
    ],
  },
  {
    day: 5, date: 'Sep 18', title: 'Youth Night', color: 'from-blue-600 to-blue-400',
    events: [
      { time: '6:00 AM', name: 'Pratah Puja' },
      { time: '11:00 AM', name: 'Special Havan' },
      { time: '5:00 PM', name: 'Youth Talent Show' },
      { time: '8:00 PM', name: 'DJ & Dance Night' },
    ],
  },
  {
    day: 6, date: 'Sep 19', title: 'Grand Celebration', color: 'from-purple-600 to-purple-400',
    events: [
      { time: '6:00 AM', name: 'Pratah Puja' },
      { time: '11:00 AM', name: 'Community Feast' },
      { time: '5:00 PM', name: 'Special Guest Programme' },
      { time: '9:00 PM', name: 'Fireworks Display 🎆' },
    ],
  },
  {
    day: 7, date: 'Sep 20', title: 'Visarjan', color: 'from-mkcc-gold to-yellow-300',
    events: [
      { time: '6:00 AM', name: 'Pratah Puja & Final Aarti' },
      { time: '10:00 AM', name: 'Uttarpuja Ceremony' },
      { time: '3:00 PM', name: 'Visarjan Procession Begins' },
      { time: '6:00 PM', name: 'Ganesh Visarjan 🙏' },
    ],
  },
];

// ─── Countdown Hook ───────────────────────────────────────────────────────────
function useCountdown(targetDate) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, started: false, ended: false });

  useEffect(() => {
    const calc = () => {
      const now  = new Date();
      const diff = targetDate - now;
      if (diff <= 0) {
        const endDiff = PUJA_END - now;
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, started: true, ended: endDiff <= 0 });
        return;
      }
      setTime({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        started: false,
        ended:   false,
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return time;
}

// ─── Countdown Box ────────────────────────────────────────────────────────────
const CountBox = ({ value, label }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center"
  >
    <div className="relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-mkcc-gold/20 to-transparent rounded-2xl border border-mkcc-gold/40" />
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="font-display text-4xl md:text-6xl text-mkcc-gold relative z-10"
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className="font-heading text-xs text-mkcc-muted uppercase tracking-widest mt-2">{label}</span>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GaneshPuja() {
  const countdown = useCountdown(PUJA_START);
  const [activeDay, setActiveDay]   = useState(0);
  const [donorStats, setDonorStats] = useState({ totalAmount: 0, totalDonors: 0 });
  const [recentDonors, setRecentDonors] = useState([]);
  const [step, setStep]             = useState(1);
  const [amount, setAmount]         = useState('');
  const [form, setForm]             = useState({ name: '', phone: '', upiTransactionId: '', message: '', screenshotUrl: '', screenshotFileId: '' });
  const [submitting, setSubmitting] = useState(false);

  const PRESET_AMOUNTS = [51, 101, 251, 501, 1001, 2100];

  useEffect(() => {
    api.get('/donations/stats').then(r => setDonorStats(r.data.data)).catch(() => {});
    api.get('/donations/recent').then(r => setRecentDonors(r.data.data)).catch(() => {});
  }, []);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!form.screenshotUrl) { toast.error('Please upload payment screenshot!'); return; }
    if (!form.name.trim())   { toast.error('Please enter your name!'); return; }
    setSubmitting(true);
    try {
      await api.post('/donations', {
        ...form,
        amount: Number(amount),
        message: form.message || `Ganesh Puja 2026 Chandaa — ${PUJA_VENUE}`,
      });
      toast.success('🙏 Jai Ganesh! Donation submitted successfully!');
      setStep(3);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Golden radial bg */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.15) 0%, rgba(196,30,58,0.1) 40%, #0A0A0A 70%)' }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        {/* Floating decorative elements */}
        {['🪔','🌸','🙏','🌺','🪔'].map((emoji, i) => (
          <motion.div key={i}
            className="absolute text-2xl opacity-30 pointer-events-none"
            style={{ left: `${10 + i * 20}%`, top: `${20 + (i % 2) * 30}%` }}
            animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
          >
            {emoji}
          </motion.div>
        ))}

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-6xl md:text-8xl mb-4">🪔</div>
            <span className="font-heading text-mkcc-gold text-sm uppercase tracking-[0.4em]">
              MKCC Presents
            </span>
            <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-none text-white uppercase mt-2">
              Ganesh Puja
              <span className="block text-gradient-gold">2026</span>
            </h1>
            <p className="font-heading text-gray-300 text-xl mt-4 tracking-wide">
              📍 {PUJA_VENUE}
            </p>
            <p className="font-heading text-mkcc-gold text-lg mt-1">
              September 14 – 20, 2026 &nbsp;·&nbsp; 7 Days of Devotion
            </p>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-12"
          >
            {countdown.ended ? (
              <div className="font-display text-4xl text-mkcc-gold">🙏 Ganpati Bappa Morya!</div>
            ) : countdown.started ? (
              <div className="bg-mkcc-gold/20 border border-mkcc-gold/50 rounded-2xl px-8 py-4">
                <div className="font-display text-3xl text-mkcc-gold">🪔 Puja is Live!</div>
                <p className="text-gray-300 font-heading mt-1">Join us at {PUJA_VENUE}</p>
              </div>
            ) : (
              <div>
                <p className="font-heading text-mkcc-muted text-sm uppercase tracking-widest mb-6">
                  Countdown to Ganesh Puja
                </p>
                <div className="flex items-center justify-center gap-4 md:gap-8">
                  <CountBox value={countdown.days}    label="Days" />
                  <span className="font-display text-mkcc-gold text-4xl mb-6">:</span>
                  <CountBox value={countdown.hours}   label="Hours" />
                  <span className="font-display text-mkcc-gold text-4xl mb-6">:</span>
                  <CountBox value={countdown.minutes} label="Minutes" />
                  <span className="font-display text-mkcc-gold text-4xl mb-6">:</span>
                  <CountBox value={countdown.seconds} label="Seconds" />
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <a href="#donate" className="btn-gold text-base">💛 Donate for Puja</a>
            <a href="#programme" className="btn-outline text-base">📅 View Programme</a>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT PUJA ── */}
      <section className="py-20 bg-mkcc-dark">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="font-heading text-mkcc-gold text-sm uppercase tracking-[0.3em]">Our Sacred Festival</span>
            <h2 className="font-display text-5xl text-white mt-2 mb-6 uppercase">
              About <span className="text-gradient-gold">Ganesh Puja</span>
            </h2>
            <p className="text-gray-300 font-body leading-relaxed mb-4">
              Every year, Maa Kali Cricket Club organises a grand <strong className="text-mkcc-gold">Ganesh Puja celebration</strong> in Patuli, Olaver — a 7-day festival of devotion, culture, music, and community unity.
            </p>
            <p className="text-gray-400 font-body leading-relaxed mb-4">
              What began as a small community puja has grown into one of the most celebrated events in Olaver, attracting over <strong className="text-white">1000+ visitors</strong> from neighboring villages every year.
            </p>
            <p className="text-gray-400 font-body leading-relaxed">
              The festival features elaborate puja rituals, cultural performances, cricket exhibition matches, community feasts, music nights, and ends with a grand Visarjan procession.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: '🙏', title: '7 Days', desc: 'of Puja & Celebrations' },
              { icon: '👥', title: '1000+', desc: 'Visitors Every Year' },
              { icon: '🎭', title: 'Cultural', desc: 'Music, Dance & Drama' },
              { icon: '🏏', title: 'Cricket', desc: 'Exhibition Matches' },
              { icon: '🍽️', title: 'Mahaprasad', desc: 'Community Feast' },
              { icon: '🎆', title: 'Fireworks', desc: 'Grand Finale Night' },
            ].map(({ icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="card-gold bg-mkcc-card rounded-xl p-4 text-center"
              >
                <div className="text-3xl mb-2">{icon}</div>
                <div className="font-display text-2xl text-mkcc-gold">{title}</div>
                <div className="font-heading text-mkcc-muted text-xs mt-1">{desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 7-DAY PROGRAMME ── */}
      <section id="programme" className="py-20 bg-mkcc-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="font-heading text-mkcc-gold text-sm uppercase tracking-[0.3em]">September 14–20, 2026</span>
            <h2 className="font-display text-5xl md:text-6xl text-white mt-2 uppercase">
              7-Day <span className="text-gradient-gold">Programme</span>
            </h2>
            <div className="divider-gold w-24 mx-auto mt-4" />
          </div>

          {/* Day selector tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
            {PROGRAMME.map((p, i) => (
              <button key={i} onClick={() => setActiveDay(i)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border transition-all font-heading
                  ${activeDay === i
                    ? 'bg-mkcc-gold text-mkcc-black border-mkcc-gold'
                    : 'bg-mkcc-card text-mkcc-muted border-mkcc-border hover:border-mkcc-gold hover:text-mkcc-gold'}`}>
                <span className="text-xs uppercase tracking-wider">Day {p.day}</span>
                <span className="text-sm font-bold mt-0.5">{p.date}</span>
              </button>
            ))}
          </div>

          {/* Active day detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-mkcc-card border border-mkcc-border rounded-2xl overflow-hidden"
            >
              {/* Day header */}
              <div className={`bg-gradient-to-r ${PROGRAMME[activeDay].color} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading text-black/70 text-sm uppercase tracking-widest">
                      Day {PROGRAMME[activeDay].day} · {PROGRAMME[activeDay].date}
                    </p>
                    <h3 className="font-display text-4xl text-black mt-1 uppercase">
                      {PROGRAMME[activeDay].title}
                    </h3>
                  </div>
                  <div className="text-5xl">🪔</div>
                </div>
              </div>

              {/* Events list */}
              <div className="p-6 space-y-4">
                {PROGRAMME[activeDay].events.map(({ time, name }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-4 p-4 bg-mkcc-dark rounded-xl border border-mkcc-border hover:border-mkcc-gold/40 transition-colors"
                  >
                    <div className="flex-shrink-0 w-20 text-center">
                      <span className="font-display text-mkcc-gold text-lg">{time}</span>
                    </div>
                    <div className="w-px h-8 bg-mkcc-border" />
                    <p className="font-heading font-semibold text-white text-base">{name}</p>
                  </motion.div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between px-6 pb-6">
                <button onClick={() => setActiveDay(d => Math.max(0, d - 1))}
                  disabled={activeDay === 0}
                  className="font-heading text-sm text-mkcc-muted border border-mkcc-border px-4 py-2 rounded disabled:opacity-30 hover:text-white hover:border-mkcc-gold transition-colors">
                  ← Previous Day
                </button>
                <button onClick={() => setActiveDay(d => Math.min(PROGRAMME.length - 1, d + 1))}
                  disabled={activeDay === PROGRAMME.length - 1}
                  className="font-heading text-sm text-mkcc-muted border border-mkcc-border px-4 py-2 rounded disabled:opacity-30 hover:text-white hover:border-mkcc-gold transition-colors">
                  Next Day →
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── DONATE ── */}
      <section id="donate" className="py-20 bg-mkcc-dark">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="font-heading text-mkcc-gold text-sm uppercase tracking-[0.3em]">Support the Celebration</span>
            <h2 className="font-display text-5xl md:text-6xl text-white mt-2 uppercase">
              Puja <span className="text-gradient-gold">Chandaa</span>
            </h2>
            <p className="text-gray-400 font-body mt-3">
              Your contribution helps us celebrate Ganesh Puja with full devotion and grandeur 🙏
            </p>
            <div className="divider-gold w-24 mx-auto mt-4" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="card-gold bg-mkcc-card rounded-2xl p-6 text-center">
              <div className="text-4xl mb-2">💰</div>
              <p className="font-display text-4xl text-mkcc-gold">
                ₹{donorStats.totalAmount?.toLocaleString('en-IN') || '0'}
              </p>
              <p className="font-heading text-mkcc-muted text-sm uppercase tracking-wider mt-1">Total Raised</p>
            </div>
            <div className="card-gold bg-mkcc-card rounded-2xl p-6 text-center">
              <div className="text-4xl mb-2">🙏</div>
              <p className="font-display text-4xl text-mkcc-gold">
                {donorStats.totalDonors || 0}
              </p>
              <p className="font-heading text-mkcc-muted text-sm uppercase tracking-wider mt-1">Proud Donors</p>
            </div>
          </div>

          {/* Donation tiers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { emoji: '🥉', label: 'Supporter',  min: 101  },
              { emoji: '🥈', label: 'Devotee',    min: 501  },
              { emoji: '🥇', label: 'Mahadan',    min: 1001 },
              { emoji: '👑', label: 'Platinum',   min: 5001 },
            ].map(({ emoji, label, min }) => (
              <div key={label} className="bg-mkcc-card border border-mkcc-border rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">{emoji}</div>
                <p className="font-heading font-bold text-white text-sm">{label}</p>
                <p className="font-body text-mkcc-muted text-xs mt-1">₹{min.toLocaleString('en-IN')}+</p>
              </div>
            ))}
          </div>

          {/* Donation Form */}
          <div className="card-gold bg-mkcc-card rounded-2xl overflow-hidden">
            {/* Step indicator */}
            <div className="flex border-b border-mkcc-border">
              {[
                { n: 1, label: 'Choose Amount' },
                { n: 2, label: 'Confirm' },
                { n: 3, label: 'Done' },
              ].map(({ n, label }) => (
                <div key={n} className={`flex-1 py-3 text-center font-heading text-xs uppercase tracking-wider
                  ${step === n ? 'bg-mkcc-gold text-mkcc-black font-bold' :
                    step > n ? 'bg-mkcc-gold/20 text-mkcc-gold' : 'text-mkcc-muted'}`}>
                  {step > n ? '✓' : n}. {label}
                </div>
              ))}
            </div>

            <div className="p-8">
              {/* Step 1 — Amount */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="font-display text-3xl text-white mb-6 uppercase">Select Amount</h3>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {PRESET_AMOUNTS.map(a => (
                      <button key={a} onClick={() => setAmount(String(a))}
                        className={`font-heading font-bold py-3 rounded-xl border text-sm transition-all
                          ${amount === String(a)
                            ? 'bg-mkcc-gold text-mkcc-black border-mkcc-gold'
                            : 'bg-mkcc-dark text-white border-mkcc-border hover:border-mkcc-gold hover:text-mkcc-gold'}`}>
                        ₹{a.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                  <div className="mb-6">
                    <label className="block font-heading text-gray-300 text-xs mb-2 uppercase tracking-wider">
                      Or Enter Custom Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-mkcc-gold text-xl">₹</span>
                      <input
                        type="number" value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full bg-mkcc-dark border border-mkcc-border rounded-xl pl-10 pr-4 py-3 text-white font-body focus:border-mkcc-gold focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => { if (!amount || Number(amount) < 1) { toast.error('Please select or enter an amount'); return; } setStep(2); }}
                    className="btn-gold w-full text-base py-4"
                  >
                    🙏 Proceed to Donate
                  </button>
                </motion.div>
              )}

              {/* Step 2 — Confirm */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-3xl text-white uppercase">Confirm Donation</h3>
                    <button onClick={() => setStep(1)} className="text-mkcc-muted hover:text-white font-heading text-sm">← Back</button>
                  </div>

                  <div className="bg-mkcc-dark border border-mkcc-gold/30 rounded-xl p-4 mb-6 flex items-center justify-between">
                    <span className="font-heading text-mkcc-muted uppercase tracking-wider text-sm">Amount</span>
                    <span className="font-display text-mkcc-gold text-3xl">₹{Number(amount).toLocaleString('en-IN')}</span>
                  </div>

                  <p className="font-heading text-white text-sm mb-4 uppercase tracking-wider">
                    1. Pay via UPI — scan QR or use UPI ID
                  </p>
                  <div className="bg-mkcc-dark border border-mkcc-border rounded-xl p-4 mb-6 text-center">
                    <p className="font-heading text-mkcc-gold font-bold text-lg">mkcc.patuli@upi</p>
                    <p className="text-mkcc-muted text-xs mt-1 font-body">Maa Kali Cricket Club</p>
                  </div>

                  <form onSubmit={handleDonate} className="space-y-4">
                    <div>
                      <label className="block font-heading text-gray-300 text-xs mb-2 uppercase tracking-wider">
                        Payment Screenshot * <span className="text-mkcc-muted normal-case">(required for verification)</span>
                      </label>
                      <ImageUpload
                        label="Upload Payment Screenshot"
                        folder="/mkcc/donations"
                        preview={form.screenshotUrl}
                        onUpload={(url, fileId) => setForm(f => ({ ...f, screenshotUrl: url, screenshotFileId: fileId || '' }))}
                      />
                    </div>
                    <div>
                      <label className="block font-heading text-gray-300 text-xs mb-2 uppercase tracking-wider">Your Name *</label>
                      <input type="text" required value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Full name"
                        className="w-full bg-mkcc-dark border border-mkcc-border rounded-xl px-4 py-3 text-white font-body focus:border-mkcc-gold focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block font-heading text-gray-300 text-xs mb-2 uppercase tracking-wider">Phone Number</label>
                      <input type="tel" value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-mkcc-dark border border-mkcc-border rounded-xl px-4 py-3 text-white font-body focus:border-mkcc-gold focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block font-heading text-gray-300 text-xs mb-2 uppercase tracking-wider">
                        UPI Transaction ID <span className="text-mkcc-muted normal-case tracking-normal">(optional)</span>
                      </label>
                      <input type="text" value={form.upiTransactionId}
                        onChange={e => setForm(f => ({ ...f, upiTransactionId: e.target.value }))}
                        placeholder="e.g. 123456789012"
                        className="w-full bg-mkcc-dark border border-mkcc-border rounded-xl px-4 py-3 text-white font-body focus:border-mkcc-gold focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block font-heading text-gray-300 text-xs mb-2 uppercase tracking-wider">
                        Message <span className="text-mkcc-muted normal-case tracking-normal">(optional)</span>
                      </label>
                      <input type="text" value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Ganpati Bappa Morya! 🙏"
                        className="w-full bg-mkcc-dark border border-mkcc-border rounded-xl px-4 py-3 text-white font-body focus:border-mkcc-gold focus:outline-none transition-colors" />
                    </div>
                    <button type="submit" disabled={submitting} className="btn-gold w-full text-base py-4">
                      {submitting ? '⏳ Submitting...' : '🙏 Submit Chandaa'}
                    </button>
                    <p className="text-mkcc-muted text-xs text-center font-body">
                      Your donation will be verified by admin and added to the counter.
                    </p>
                  </form>
                </motion.div>
              )}

              {/* Step 3 — Success */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8 }}
                    className="text-8xl mb-6"
                  >
                    🙏
                  </motion.div>
                  <h3 className="font-display text-4xl text-mkcc-gold uppercase mb-3">Jai Ganesh!</h3>
                  <p className="text-gray-300 font-body text-lg mb-2">
                    Thank you for your generous Chandaa!
                  </p>
                  <p className="text-mkcc-muted font-body text-sm mb-8">
                    Your donation is under review and will appear on the counter once approved by admin.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={() => { setStep(1); setAmount(''); setForm({ name:'', phone:'', upiTransactionId:'', message:'', screenshotUrl:'', screenshotFileId:'' }); }}
                      className="btn-gold text-sm py-3">
                      💛 Donate Again
                    </button>
                    <Link to="/" className="btn-outline text-sm py-3">← Back to Home</Link>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Recent Donors */}
          {recentDonors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 bg-mkcc-card border border-mkcc-border rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-mkcc-border bg-mkcc-dark/50 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
                <h3 className="font-heading font-bold text-white uppercase tracking-wider">Puja Supporters</h3>
              </div>
              <div className="divide-y divide-mkcc-border/50">
                {recentDonors.slice(0, 5).map((donor, i) => (
                  <div key={donor._id} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-display text-lg flex-shrink-0 bg-mkcc-gold/10 border border-mkcc-gold/30 text-mkcc-gold">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : donor.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-white truncate">{donor.name}</p>
                      {donor.message && <p className="text-mkcc-muted text-xs italic truncate">"{donor.message}"</p>}
                    </div>
                    <p className="font-display text-mkcc-gold text-xl">₹{donor.amount?.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section className="py-20 bg-mkcc-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="font-heading text-mkcc-gold text-sm uppercase tracking-[0.3em]">Where to Find Us</span>
          <h2 className="font-display text-5xl text-white mt-2 mb-8 uppercase">
            Venue & <span className="text-gradient-gold">Location</span>
          </h2>
          <div className="rounded-2xl overflow-hidden card-gold h-80 mb-6">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.5!2d86.6606726!3d20.7325231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1b9500789edead%3A0xbe268b7c0ebf0a07!2sPMM6%2B26%20M.K.C.C%20patuli!5e0!3m2!1sen!2sin!4v1"
              width="100%" height="100%" style={{ border: 0 }}
              allowFullScreen="" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ganesh Puja Location"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-gray-300 font-heading">
              <span className="text-2xl">📍</span>
              <span>{PUJA_VENUE}</span>
            </div>
            <a href="https://maps.app.goo.gl/neURRfri4PNFAA2r5" target="_blank" rel="noopener noreferrer"
              className="btn-outline text-sm py-2">
              Open in Google Maps →
            </a>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 bg-mkcc-dark relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.1) 0%, transparent 70%)' }} />
        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <div className="text-6xl mb-4">🪔</div>
          <h2 className="font-display text-5xl text-white uppercase mb-4">
            Ganpati Bappa <span className="text-gradient-gold">Morya!</span>
          </h2>
          <p className="text-gray-400 font-body mb-8">
            Join us for 7 days of devotion, culture, and celebration in Patuli, Olaver.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#donate" className="btn-gold text-base">💛 Support Ganesh Puja</a>
            <Link to="/contact#join" className="btn-primary text-base">Join MKCC 🏏</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

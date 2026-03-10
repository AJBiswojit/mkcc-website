import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import DonationCounter from '../../components/DonationCounter/DonationCounter';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import MKCCLogo from '../../components/Logo/MKCCLogo';

// ── UPI details — change these to your actual UPI ID ─────────────────────────
const UPI_ID = '8984408388-2@ybl';      // ← replace with your UPI ID
const UPI_NAME = 'Maa Kali Cricket Club';
const UPI_QR = 'https://ik.imagekit.io/ugib3fcb8/mkcc/Badal%20Behera%20qr.png'; // Set to your ImageKit QR URL after uploading, e.g.:
// 'https://ik.imagekit.io/ugib3fcb8/mkcc/qr%20code.jpeg'

// Preset donation amounts
const PRESETS = [51, 101, 251, 501, 1001, 2101];

// Steps: 'scan' → 'form' → 'success'
const STEPS = { SCAN: 'scan', FORM: 'form', SUCCESS: 'success' };

export default function Donate() {
  const [step, setStep] = useState(STEPS.SCAN);
  const [stats, setStats] = useState({ totalAmount: 0, totalDonors: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentDonors, setRecentDonors] = useState([]);
  const [selectedAmt, setSelectedAmt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [form, setForm] = useState({
    name: '', phone: '', amount: '',
    upiTransactionId: '', screenshotUrl: '',
    screenshotFileId: '', message: '',
  });

  // Load stats
  useEffect(() => {
    api.get('/donations/stats')
      .then(r => setStats(r.data.data))
      .catch(() => { })
      .finally(() => setStatsLoading(false));
    api.get('/donations/recent')
      .then(r => setRecentDonors(r.data.data))
      .catch(() => { });
  }, []);

  const handlePreset = (amt) => {
    setSelectedAmt(amt);
    setForm(f => ({ ...f, amount: String(amt) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.screenshotUrl) {
      toast.error('Please upload your payment screenshot.');
      return;
    }
    if (!form.amount || Number(form.amount) < 1) {
      toast.error('Please enter a valid amount.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/donations', form);
      setStep(STEPS.SUCCESS);
      // Refresh stats
      api.get('/donations/stats').then(r => setStats(r.data.data)).catch(() => { });
      api.get('/donations/recent').then(r => setRecentDonors(r.data.data)).catch(() => { });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-mkcc-black">

      {/* ── Hero ── */}
      <div className="relative bg-mkcc-dark py-16 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.1) 0%, transparent 60%)' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative px-4">
          <span className="font-heading text-mkcc-gold text-sm uppercase tracking-[0.3em]">Support Our Club</span>
          <h1 className="font-display text-6xl md:text-8xl text-white mt-2 uppercase">
            Donate to <span className="text-gradient-gold">MKCC</span>
          </h1>
          <p className="text-gray-400 font-body text-lg mt-3 max-w-xl mx-auto">
            Your contribution helps us organise cricket tournaments, cultural events, and nurture young talent in Patuli, Olaver.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14 space-y-10">

        {/* ── Donation Counter ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <DonationCounter
            totalAmount={stats.totalAmount}
            totalDonors={stats.totalDonors}
            loading={statsLoading}
          />
        </motion.div>

        {/* ── Step Indicator ── */}
        <div className="flex items-center justify-center gap-3">
          {[
            { key: STEPS.SCAN, label: '1. Scan & Pay' },
            { key: STEPS.FORM, label: '2. Confirm' },
            { key: STEPS.SUCCESS, label: '3. Done' },
          ].map(({ key, label }, i) => {
            const done = (step === STEPS.FORM && i === 0) || step === STEPS.SUCCESS;
            const active = step === key;
            return (
              <div key={key} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-heading text-sm font-semibold transition-all
                  ${active ? 'bg-mkcc-red text-white shadow-[0_0_15px_rgba(196,30,58,0.5)]' : ''}
                  ${done ? 'bg-green-800/40 text-green-400' : ''}
                  ${!active && !done ? 'bg-mkcc-card text-mkcc-muted border border-mkcc-border' : ''}`}>
                  {done ? '✓' : i + 1}. {label}
                </div>
                {i < 2 && <div className="w-6 h-px bg-mkcc-border hidden sm:block" />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">

          {/* ══════════════════════════════════════════
              STEP 1 — QR Code + Scan & Pay
          ══════════════════════════════════════════ */}
          {step === STEPS.SCAN && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* QR Code */}
              <div className="card-gold bg-mkcc-card rounded-2xl p-8 flex flex-col items-center text-center">
                <h2 className="font-display text-3xl text-white uppercase mb-6">Scan QR to Pay</h2>

                {/* QR Image */}
                <div className="relative mb-6">
                  <div className="w-56 h-56 bg-white rounded-2xl flex items-center justify-center p-3 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                    {UPI_QR ? (
                      <img src={UPI_QR} alt="UPI QR Code" className="w-full h-full object-contain" />
                    ) : (
                      /* Placeholder QR pattern when no image uploaded */
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <div className="grid grid-cols-7 gap-0.5">
                          {Array.from({ length: 49 }).map((_, i) => (
                            <div key={i} className={`w-4 h-4 rounded-sm ${[0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41, 42, 43, 44, 45, 46, 47, 48,
                                8, 15, 22, 29, 36, 10, 17, 24, 31, 38, 11, 18, 25, 32, 39].includes(i)
                                ? 'bg-black' : 'bg-white'
                              }`} />
                          ))}
                        </div>
                        <p className="text-gray-400 text-xs text-center px-2">Upload your UPI QR in Admin → Settings</p>
                      </div>
                    )}
                  </div>
                  {/* Corners — each shows only its 2 relevant sides */}
                  {[
                    { cls: 'top-0 left-0', style: { borderWidth: '3px 0 0 3px', transform: 'translate(-6px, -6px)' } },
                    { cls: 'top-0 right-0', style: { borderWidth: '3px 3px 0 0', transform: 'translate(6px, -6px)' } },
                    { cls: 'bottom-0 left-0', style: { borderWidth: '0 0 3px 3px', transform: 'translate(-6px, 6px)' } },
                    { cls: 'bottom-0 right-0', style: { borderWidth: '0 3px 3px 0', transform: 'translate(6px, 6px)' } },
                  ].map(({ cls, style }, i) => (
                    <div
                      key={i}
                      className={`absolute ${cls} w-6 h-6 rounded-sm`}
                      style={{ ...style, borderColor: '#D4AF37', borderStyle: 'solid' }}
                    />
                  ))}
                </div>

                {/* UPI ID */}
                <div className="bg-mkcc-dark border border-mkcc-gold/30 rounded-xl px-5 py-3 w-full mb-4">
                  <p className="font-heading text-mkcc-muted text-xs uppercase tracking-widest mb-1">UPI ID</p>
                  <p className="font-heading font-bold text-mkcc-gold text-lg tracking-wide">{UPI_ID}</p>
                  <p className="font-body text-gray-400 text-sm">{UPI_NAME}</p>
                </div>

                {/* UPI Apps */}
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                  {['📱 GPay', '💳 PhonePe', '🏦 Paytm', '💰 BHIM'].map(app => (
                    <span key={app} className="bg-mkcc-dark border border-mkcc-border text-mkcc-muted font-heading text-xs px-3 py-1 rounded-full">{app}</span>
                  ))}
                </div>
                <p className="text-mkcc-muted text-xs font-body">Pay any amount using any UPI app</p>
                <p className="text-mkcc-gold text-xs font-body">"All donations go directly towards MKCC cricket tournaments, Ganesh Puja celebrations, and youth development in Patuli, Olaver."</p>
              </div>

              {/* Preset amounts + proceed */}
              <div className="space-y-6">
                <div className="card-glow bg-mkcc-card rounded-2xl p-6">
                  <h3 className="font-heading font-bold text-white text-lg uppercase tracking-wider mb-4">
                    Choose Amount
                  </h3>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {PRESETS.map(amt => (
                      <button
                        key={amt}
                        onClick={() => handlePreset(amt)}
                        className={`py-3 rounded-xl font-heading font-bold text-base transition-all
                          ${selectedAmt === amt
                            ? 'bg-mkcc-red text-white shadow-[0_0_15px_rgba(196,30,58,0.5)]'
                            : 'bg-mkcc-dark border border-mkcc-border text-white hover:border-mkcc-gold hover:text-mkcc-gold'}`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                  {/* Custom amount */}
                  <div>
                    <label className="block font-heading text-gray-300 text-xs mb-1.5 uppercase tracking-wider">
                      Or enter custom amount (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.amount}
                      onChange={e => { setForm(f => ({ ...f, amount: e.target.value })); setSelectedAmt(''); }}
                      placeholder="e.g. 750"
                      className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body text-lg focus:border-mkcc-gold focus:outline-none focus:ring-1 focus:ring-mkcc-gold transition-colors"
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-mkcc-dark border border-mkcc-border rounded-xl p-5 space-y-3">
                  <h4 className="font-heading font-bold text-mkcc-gold text-base uppercase tracking-wider">How to Donate</h4>
                  {[
                    { n: '1', text: 'Take a Screenshot of the QR code or use UPI ID above' },
                    { n: '2', text: 'Open any UPI app and go to the scanner, upload that screenshot and complete the payment' },
                    { n: '3', text: 'Take a screenshot of the payment confirmation' },
                    { n: '4', text: 'Come back to the website and enter the amount you have paid⬆' },
                    { n: '5', text: 'Click the button below and submit your details' },
                  ].map(({ n, text }) => (
                    <div key={n} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-mkcc-red rounded-full flex items-center justify-center flex-shrink-0 font-display text-white text-sm">{n}</div>
                      <p className="text-gray-400 font-body text-sm leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (!form.amount || Number(form.amount) < 1) {
                      toast.error('Please select or enter a donation amount first.');
                      return;
                    }
                    setStep(STEPS.FORM);
                  }}
                  className="btn-gold w-full text-base py-4 text-center"
                >
                  ✅ I've Paid — Submit Confirmation →
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════
              STEP 2 — Confirmation Form
          ══════════════════════════════════════════ */}
          {step === STEPS.FORM && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="max-w-xl mx-auto"
            >
              <div className="card-glow bg-mkcc-card rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-3xl text-white uppercase">Confirm Payment</h2>
                  <button onClick={() => setStep(STEPS.SCAN)}
                    className="text-mkcc-muted hover:text-white font-heading text-sm border border-mkcc-border rounded px-3 py-1 transition-colors">
                    ← Back
                  </button>
                </div>

                {/* Amount summary */}
                <div className="bg-mkcc-red/10 border border-mkcc-red/30 rounded-xl p-4 mb-6 flex items-center justify-between">
                  <div>
                    <p className="font-heading text-mkcc-muted text-xs uppercase tracking-wider">Amount Paid</p>
                    <p className="font-display text-4xl text-mkcc-gold">₹{Number(form.amount).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-4xl">🙏</div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Screenshot Upload */}
                  <div>
                    <label className="block font-heading text-gray-300 text-xs mb-2 uppercase tracking-wider">
                      Payment Screenshot * <span className="text-mkcc-muted normal-case tracking-normal">(required for verification)</span>
                    </label>
                    <ImageUpload
                      label="Upload Payment Screenshot"
                      folder="/mkcc/donations"
                      preview={form.screenshotUrl}
                      onUpload={(url, fileId) => setForm(f => ({ ...f, screenshotUrl: url, screenshotFileId: fileId || '' }))}
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block font-heading text-gray-300 text-xs mb-1.5 uppercase tracking-wider">Your Name *</label>
                    <input
                      type="text" required value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Full name"
                      className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body focus:border-mkcc-gold focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-heading text-gray-300 text-xs mb-1.5 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body focus:border-mkcc-gold focus:outline-none transition-colors"
                    />
                  </div>

                  {/* UPI Transaction ID */}
                  <div>
                    <label className="block font-heading text-gray-300 text-xs mb-1.5 uppercase tracking-wider">
                      UPI Transaction ID <span className="text-mkcc-muted normal-case tracking-normal">(optional but helpful)</span>
                    </label>
                    <input
                      type="text" value={form.upiTransactionId}
                      onChange={e => setForm(f => ({ ...f, upiTransactionId: e.target.value }))}
                      placeholder="e.g. 123456789012"
                      className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body focus:border-mkcc-gold focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-heading text-gray-300 text-xs mb-1.5 uppercase tracking-wider">Message (optional)</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="A message for MKCC..."
                      rows={3}
                      className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body focus:border-mkcc-gold focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full text-base py-4"
                  >
                    {submitting ? '⏳ Submitting...' : '🙏 Submit Donation Confirmation'}
                  </button>

                  <p className="text-mkcc-muted text-xs text-center font-body">
                    Your donation will be verified by admin and added to the counter.
                  </p>
                </form>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════
              STEP 3 — Success
          ══════════════════════════════════════════ */}
          {step === STEPS.SUCCESS && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="card-gold bg-mkcc-card rounded-2xl p-10">
                {/* Animated tick */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                  className="w-24 h-24 bg-green-700/30 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <span className="text-5xl">✅</span>
                </motion.div>

                <MKCCLogo size={60} className="mx-auto mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />

                <h2 className="font-display text-4xl text-white uppercase mb-3">
                  Jai Maa Kali! 🙏
                </h2>
                <p className="font-heading text-mkcc-gold text-xl font-semibold mb-2">
                  ₹{Number(form.amount).toLocaleString('en-IN')} — Received
                </p>
                <p className="text-gray-400 font-body leading-relaxed mb-6">
                  Thank you <strong className="text-white">{form.name}</strong>! Your donation has been submitted successfully.
                  Our admin will verify your payment and it will reflect in the counter shortly.
                </p>

                {/* What happens next */}
                <div className="bg-mkcc-dark border border-mkcc-border rounded-xl p-4 text-left mb-6 space-y-2">
                  <p className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-2">What happens next?</p>
                  {[
                    '📋 Admin reviews your screenshot',
                    '✅ Donation approved & counter updated',
                    '🏏 Funds go towards MKCC activities',
                  ].map(t => (
                    <p key={t} className="text-gray-400 text-sm font-body">{t}</p>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => { setStep(STEPS.SCAN); setForm({ name: '', phone: '', amount: '', upiTransactionId: '', screenshotUrl: '', screenshotFileId: '', message: '' }); setSelectedAmt(''); }}
                    className="btn-outline text-sm py-2"
                  >
                    💰 Donate Again
                  </button>
                  <a href="/" className="btn-gold text-sm py-2 text-center">🏠 Back to Home</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Recent Donors ── */}
        {recentDonors.length > 0 && step === STEPS.SCAN && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-mkcc-card border border-mkcc-border rounded-2xl p-6"
          >
            <h3 className="font-heading font-bold text-white text-lg uppercase tracking-wider mb-4">
              🏆 Recent Donors
            </h3>
            <div className="space-y-3">
              {recentDonors.map((d, i) => (
                <motion.div
                  key={d._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between py-2 border-b border-mkcc-border/50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-mkcc-red/20 border border-mkcc-red/30 rounded-full flex items-center justify-center font-display text-mkcc-gold text-base">
                      {d.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-white text-sm">{d.name}</p>
                      {d.message && <p className="text-mkcc-muted text-xs font-body italic">"{d.message}"</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-mkcc-gold text-lg">₹{d.amount?.toLocaleString('en-IN')}</p>
                    <p className="text-mkcc-muted text-xs font-body">
                      {new Date(d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
